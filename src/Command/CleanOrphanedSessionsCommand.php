<?php

namespace App\Command;

use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\AnonymousUserRepository;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
	name: 'app:clean-orphaned-sessions',
	description: 'Supprime les sessions qui ne sont pas associées à un utilisateur anonyme.',
)]
class CleanOrphanedSessionsCommand extends Command
{
	private Connection $connection;
	private AnonymousUserRepository $anonymousUserRepository;

	public function __construct(
		Connection $connection,
		AnonymousUserRepository $anonymousUserRepository
	) {
		$this->connection = $connection;
		$this->anonymousUserRepository = $anonymousUserRepository;

		parent::__construct();
	}

	protected function execute(InputInterface $input, OutputInterface $output): int
	{
		$output->writeln('Nettoyage des sessions orphelines...');

		// Récupérer tous les IDs de sessions associés aux utilisateurs anonymes
		$anonymousSessionIds = $this->anonymousUserRepository->createQueryBuilder('u')
			->select('u.sessionId')
			->getQuery()
			->getScalarResult();

		$anonymousSessionIds = array_column($anonymousSessionIds, 'sessionId');

		// Récupérer toutes les sessions de la table `sessions`
		$sessions = $this->connection->createQueryBuilder()
			->select('sess_id')
			->from('sessions')
			->executeQuery()
			->fetchAllAssociative();

		$orphanedSessions = [];

		foreach ($sessions as $session) {
			if (!in_array($session['sess_id'], $anonymousSessionIds)) {
				$orphanedSessions[] = $session['sess_id'];
			}
		}

		// Supprimer les sessions orphelines
		if (!empty($orphanedSessions)) {
			$this->connection->createQueryBuilder()
				->delete('sessions')
				->where('sess_id IN (:sessIds)')
				->setParameter('sessIds', $orphanedSessions, Connection::PARAM_STR_ARRAY)
				->executeStatement();

			$output->writeln(sprintf('Nettoyage terminé. %d sessions orphelines supprimées.', count($orphanedSessions)));
		} else {
			$output->writeln('Aucune session orpheline trouvée.');
		}

		return Command::SUCCESS;
	}
}

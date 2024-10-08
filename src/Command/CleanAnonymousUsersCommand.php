<?php

namespace App\Command;

use Doctrine\ORM\EntityManagerInterface;
use App\Repository\AnonymousUserRepository;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
	name: 'app:clean-anonymous-users',
	description: 'Nettoie les utilisateurs anonymes sans simulations et leurs sessions.',
)]
class CleanAnonymousUsersCommand extends Command
{
	private EntityManagerInterface $entityManager;
	private AnonymousUserRepository $anonymousUserRepository;

	public function __construct(
		EntityManagerInterface $entityManager,
		AnonymousUserRepository $anonymousUserRepository
	) {
		$this->entityManager = $entityManager;
		$this->anonymousUserRepository = $anonymousUserRepository;

		parent::__construct();
	}

	protected function execute(InputInterface $input, OutputInterface $output): int
	{
		$output->writeln('Nettoyage des utilisateurs anonymes sans simulations et de leurs sessions...');

		// Critère pour identifier les utilisateurs anonymes à supprimer
		$anonymousUsers = $this->anonymousUserRepository->createQueryBuilder('u')
			->leftJoin('u.simulations', 's')
			->where('s.id IS NULL') // Condition pour utilisateurs sans simulations
			->getQuery()
			->getResult();

		foreach ($anonymousUsers as $anonymousUser) {
			// Supprimer l'utilisateur anonyme
			$this->entityManager->remove($anonymousUser);
		}

		$this->entityManager->flush();

		$output->writeln(sprintf('Nettoyage terminé. %d utilisateurs anonymes sans simulations supprimés.', count($anonymousUsers)));

		return Command::SUCCESS;
	}
}

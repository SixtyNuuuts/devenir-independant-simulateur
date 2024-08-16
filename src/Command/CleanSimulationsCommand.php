<?php

namespace App\Command;

use App\Repository\SimulationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
	name: 'app:clean-simulations',
	description: 'Delete simulations older than 4 hours with matching update dates except those with the "default" token',
)]
class CleanSimulationsCommand extends Command
{
	private $entityManager;
	private $simulationRepository;

	public function __construct(EntityManagerInterface $entityManager, SimulationRepository $simulationRepository)
	{
		$this->entityManager = $entityManager;
		$this->simulationRepository = $simulationRepository;

		parent::__construct();
	}

	protected function configure(): void
	{
		$this
			->setDescription('Deletes simulations older than 4 hours with matching update dates except those with the "default" token.');
	}

	protected function execute(InputInterface $input, OutputInterface $output): int
	{
		// Augmente la limite de mémoire pour ce script à 1 Go
		ini_set('memory_limit', '1024M');

		$now = new \DateTime();
		$now->modify('-4 hours');

		$simulations = $this->simulationRepository->createQueryBuilder('s')
			->where('s.updatedAt <= :fourHoursAgo')
			->andWhere('s.token != :defaultToken')
			->setParameter('fourHoursAgo', $now)
			->setParameter('defaultToken', 'default')
			->getQuery()
			->getResult();

		$count = 0;
		foreach ($simulations as $simulation) {
			if ($simulation->getUpdatedAt() == $simulation->getCreatedAt()) {
				$this->entityManager->remove($simulation);
				$count++;
			}
		}

		$this->entityManager->flush();

		$output->writeln("$count simulations have been deleted.");

		return Command::SUCCESS;
	}
}

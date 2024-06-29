<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\AnonymousUser;
use App\Entity\Simulation;
use App\Entity\User;
use App\Repository\ActivityRepository;
use App\Repository\SimulationRepository;
use App\Security\UserService;
use Doctrine\ORM\EntityManagerInterface;

class SimulationService
{
	public function __construct(
		private UserService $userService,
		private EntityManagerInterface $entityManager,
		private ActivityRepository $activityRepository,
		private SimulationRepository $simulationRepository,
	) {
	}

	public function createSimulation(string $activitySlug): Simulation
	{
		$activity = $this->activityRepository->findOneBy(['slug' => $activitySlug]);
		if (!$activity) {
			throw new \Exception('Activité non trouvée');
		}

		$defaultSimulation = $this->simulationRepository->findOneBy(['activity' => $activity, 'token' => 'default']);
		if (!$defaultSimulation) {
			throw new \Exception('Simulation Defaut non trouvée');
		}

		$currentUser = $this->userService->getCurrentUser();
		$simulation = new Simulation();
		$simulation->setActivity($activity);

		if ($currentUser instanceof User || $currentUser instanceof AnonymousUser) {
			if ($currentUser->getType() === 'user') {
				$simulation->setUser($currentUser);
			} else {
				$simulation->setAnonymousUser($currentUser);
			}
		}

		foreach ($defaultSimulation->getFinancialItems() as $financialItem) {
			$newFinancialItem = clone $financialItem;
			$newFinancialItem->setSimulation($simulation);
			$simulation->addFinancialItem($newFinancialItem);
			$this->entityManager->persist($newFinancialItem);
		}

		$this->entityManager->persist($simulation);
		$this->entityManager->flush();

		return $simulation;
	}
}

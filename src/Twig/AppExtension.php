<?php

declare(strict_types=1);

namespace App\Twig;

use App\Repository\ActivityRepository;
use App\Repository\SimulationRepository;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class AppExtension extends AbstractExtension
{
	public function __construct(
		private SimulationRepository $simulationRepository,
		private ActivityRepository $activityRepository,
	) {
	}

	public function getFunctions(): array
	{
		return [
			new TwigFunction('get_simulations_models', [$this, 'getSimulationsModels']),
			new TwigFunction('count_activities', [$this, 'countActivities']),
		];
	}

	public function getSimulationsModels(): mixed
	{
		return $this->simulationRepository->findAllSimulationsModels();
	}

	public function countActivities(): int
	{
		return $this->activityRepository->countAllActivities();
	}
}

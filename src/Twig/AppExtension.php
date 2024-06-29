<?php

declare(strict_types=1);

namespace App\Twig;

use App\Repository\SimulationRepository;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class AppExtension extends AbstractExtension
{
	public function __construct(
		private SimulationRepository $simulationRepository,
	) {
	}

	public function getFunctions(): array
	{
		return [
			new TwigFunction('get_simulations_models', [$this, 'getSimulationsModels']),
		];
	}

	public function getSimulationsModels(): mixed
	{
		return $this->simulationRepository->findAllSimulationsModels();
	}
}

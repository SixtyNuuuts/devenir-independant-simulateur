<?php

declare(strict_types=1);

namespace App\Twig;

use Twig\TwigFunction;
use Twig\Extension\AbstractExtension;
use App\Repository\SimulationRepository;

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

    public function getSimulationsModels()
    {
        return $this->simulationRepository->findAllSimulationsModels();
    }
}

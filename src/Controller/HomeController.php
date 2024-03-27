<?php

namespace App\Controller;

use App\Entity\Simulation;
use App\Repository\ActivityRepository;
use App\Repository\FinancialItemRepository;
use App\Repository\SimulationRepository;
use App\Security\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    public function __construct(
        private UserService $userService,
        private ActivityRepository $activityRepository,
        private SimulationRepository $simulationRepository,
        private FinancialItemRepository $financialItemRepository,
    ) {
    }

    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig');
    }

    #[Route('/{activitySlug}', name: 'app_activity_home')]
    public function activityHome(string $activitySlug): Response
    {
        $activity = $this->activityRepository->findOneBy(['slug' => $activitySlug]);
        if (!$activity) {
            return $this->redirectToRoute('app_home');
        }

        $simulation = $this->userService->getActivitySimulationByCurrentUserOrDefault($activity, $this->simulationRepository);
        if (!$simulation) {
            // throw new NotFoundHttpException('Simulation not found for the given activity.');
            return $this->redirectToRoute('app_home');
        }

        return $this->render('activity/show.html.twig', [
            'simulation' => $simulation,
        ]);
    }

    // #[Route('/{activitySlug}/new', name: 'app_activity_simulation_new')]
    // public function activitySimulationNew(string $activitySlug): Response
    // {
    // $simulation = $this->userService->createNewSimulationForCurrentUser($activity, $defaultSimulationFinancialItems);

    // return $this->render('activity/show.html.twig', [
    //     'simulation' => $simulation,
    // ]);
    // }
}

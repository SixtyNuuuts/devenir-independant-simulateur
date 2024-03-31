<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\ActivityRepository;
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
	) {
	}

	#[Route('/', name: 'app_home')]
	public function index(): Response
	{
		return $this->render('home/index.html.twig');
	}

	#[Route('/{activitySlug}/rentabilite/{simulationToken}', name: 'app_profitability', methods: ['GET'])]
	public function profitability(string $activitySlug, ?string $simulationToken = null): Response
	{
		$currentUser = $this->userService->getCurrentUser();
		$simulationData = $this->simulationRepository->findSimulationDataByCriteria($activitySlug, $simulationToken, $currentUser);

		if (!$simulationToken && $simulationData) {
			return $this->redirectToRoute('app_profitability', [
				'activitySlug' => $activitySlug,
				'simulationToken' => $simulationData['token'],
			]);
		}

		if (!$simulationData) {
			return $this->redirectToRoute('app_home');
		}

		$activityData = $this->activityRepository->findActivityDataBySlug($activitySlug);

		return $this->render('home/profitability.html.twig', ['simulationData' => $simulationData, 'activityData' => $activityData]);
	}

	#[Route('/{activitySlug}/profits/{simulationToken}', name: 'app_professional_incomes', methods: ['GET'])]
	public function professionalIncomes(string $activitySlug, ?string $simulationToken = null): Response
	{
		$currentUser = $this->userService->getCurrentUser();
		$simulationData = $this->simulationRepository->findSimulationDataByCriteria($activitySlug, $simulationToken, $currentUser);

		if (!$simulationToken && $simulationData) {
			return $this->redirectToRoute('app_professional_incomes', [
				'activitySlug' => $activitySlug,
				'simulationToken' => $simulationData['token'],
			]);
		}

		if (!$simulationData) {
			return $this->redirectToRoute('app_home');
		}

		return $this->render('home/professional_incomes.html.twig', ['simulationData' => $simulationData]);
	}

	#[Route('/{activitySlug}/frais/{simulationToken}', name: 'app_professional_expenses', methods: ['GET'])]
	public function professionalExpenses(string $activitySlug, ?string $simulationToken = null): Response
	{
		$currentUser = $this->userService->getCurrentUser();
		$simulationData = $this->simulationRepository->findSimulationDataByCriteria($activitySlug, $simulationToken, $currentUser);

		if (!$simulationToken && $simulationData) {
			return $this->redirectToRoute('app_professional_expenses', [
				'activitySlug' => $activitySlug,
				'simulationToken' => $simulationData['token'],
			]);
		}

		if (!$simulationData) {
			return $this->redirectToRoute('app_home');
		}

		return $this->render('home/professional_expenses.html.twig', ['simulationData' => $simulationData]);
	}

	#[Route('/{activitySlug}/niveau-de-vie/{simulationToken}', name: 'app_personal_incomes_expenses', methods: ['GET'])]
	public function personalIncomesExpenses(string $activitySlug, ?string $simulationToken = null): Response
	{
		$currentUser = $this->userService->getCurrentUser();
		$simulationData = $this->simulationRepository->findSimulationDataByCriteria($activitySlug, $simulationToken, $currentUser);

		if (!$simulationToken && $simulationData) {
			return $this->redirectToRoute('app_personal_incomes_expenses', [
				'activitySlug' => $activitySlug,
				'simulationToken' => $simulationData['token'],
			]);
		}

		if (!$simulationData) {
			return $this->redirectToRoute('app_home');
		}

		return $this->render('home/personal_incomes_expenses.html.twig', ['simulationData' => $simulationData]);
	}
}

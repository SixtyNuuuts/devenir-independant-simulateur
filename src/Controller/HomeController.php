<?php

declare(strict_types=1);

namespace App\Controller;

use App\Security\UserService;
use App\Service\SimulationService;
use App\Repository\ActivityRepository;
use App\Repository\SimulationRepository;
use App\Repository\FinancialItemRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class HomeController extends AbstractController
{
	public function __construct(
		private UserService $userService,
		private ActivityRepository $activityRepository,
		private SimulationRepository $simulationRepository,
		private FinancialItemRepository $fidancialItemRepository,
		private SimulationService $simulationService,
	) {
	}

	#[Route('/{activitySlug}/profits/{simulationToken}', name: 'app_professional_incomes', methods: ['GET'])]
	public function professionalIncomes(string $activitySlug, ?string $simulationToken = null): Response
	{
		$currentUser = $this->userService->getCurrentUser();
		$simulationData = $this->simulationRepository->findSimulationsDataByActivity($activitySlug, $simulationToken, $currentUser);
		if (!$simulationData || !\is_array($simulationData)) {
			return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
		}

		if ($simulationData['token'] === 'default') {
			try {
				$simulation = $this->simulationService->createSimulation($activitySlug);
				$simulationData['id'] = $simulation->getId();
				$simulationData['token'] = $simulation->getToken();
			} catch (\Exception $e) {
				return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
			}
		}

		if (!$simulationToken) {
			return $this->redirectToRoute('app_professional_incomes', [
				'activitySlug' => $activitySlug,
				'simulationToken' => $simulationData['token'],
			]);
		}

		return $this->render('home/professional_incomes.html.twig', ['simulationId' => $simulationData['id']]);
	}

	#[Route('/{activitySlug}/charges/{simulationToken}', name: 'app_professional_expenses', methods: ['GET'])]
	public function professionalExpenses(string $activitySlug, ?string $simulationToken = null): Response
	{
		$currentUser = $this->userService->getCurrentUser();
		$simulationData = $this->simulationRepository->findSimulationsDataByActivity($activitySlug, $simulationToken, $currentUser);
		if (!$simulationData || !\is_array($simulationData)) {
			return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
		}

		if ($simulationData['token'] === 'default') {
			try {
				$simulation = $this->simulationService->createSimulation($activitySlug);
				$simulationData['id'] = $simulation->getId();
				$simulationData['token'] = $simulation->getToken();
			} catch (\Exception $e) {
				return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
			}
		}

		if (!$simulationToken) {
			return $this->redirectToRoute('app_professional_expenses', [
				'activitySlug' => $activitySlug,
				'simulationToken' => $simulationData['token'],
			]);
		}

		return $this->render('home/professional_expenses.html.twig', ['simulationId' => $simulationData['id']]);
	}

	#[Route('/{activitySlug}/niveau-de-vie/{simulationToken}', name: 'app_personal_flows', methods: ['GET'])]
	public function personalIncomesExpenses(string $activitySlug, ?string $simulationToken = null): Response
	{
		$currentUser = $this->userService->getCurrentUser();
		$simulationData = $this->simulationRepository->findSimulationsDataByActivity($activitySlug, $simulationToken, $currentUser);
		if (!$simulationData || !\is_array($simulationData)) {
			return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
		}

		if ($simulationData['token'] === 'default') {
			try {
				$simulation = $this->simulationService->createSimulation($activitySlug);
				$simulationData['id'] = $simulation->getId();
				$simulationData['token'] = $simulation->getToken();
			} catch (\Exception $e) {
				return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
			}
		}

		if (!$simulationToken) {
			return $this->redirectToRoute('app_personal_flows', [
				'activitySlug' => $activitySlug,
				'simulationToken' => $simulationData['token'],
			]);
		}

		return $this->render('home/personal_flows.html.twig', ['simulationId' => $simulationData['id']]);
	}

	#[Route('/{activitySlug}/{simulationToken}', name: 'app_home', methods: ['GET'])]
	public function profitability(string $activitySlug = '', ?string $simulationToken = null): Response
	{
		$activity = $this->activityRepository->findOneBySlug($activitySlug);
		if (!$activity) {
			return $this->redirectToRoute('app_404'); // TODO : 404 page;
		}

		$currentUser = $this->userService->getCurrentUser();
		$simulationData = $this->simulationRepository->findSimulationsDataByActivity($activitySlug, $simulationToken, $currentUser);
		if (!$simulationData || !\is_array($simulationData)) {
			return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
		}

		if ($simulationData['token'] === 'default') {
			try {
				$simulation = $this->simulationService->createSimulation($activitySlug);
				$simulationData['id'] = $simulation->getId();
				$simulationData['token'] = $simulation->getToken();
			} catch (\Exception $e) {
				return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
			}
		}

		if (!$simulationToken) {
			return $this->redirectToRoute('app_home', [
				'activitySlug' => $activitySlug,
				'simulationToken' => $simulationData['token'],
			]);
		}

		return $this->render('home/index.html.twig', ['simulationId' => $simulationData['id']]);
	}
}

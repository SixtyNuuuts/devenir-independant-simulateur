<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\ActivityRepository;
use App\Repository\SimulationRepository;
use App\Security\UserService;
use App\Service\SimulationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class HomeController extends AbstractController
{
	public function __construct(
		private UserService $userService,
		private ActivityRepository $activityRepository,
		private SimulationRepository $simulationRepository,
		private SimulationService $simulationService,
	) {}

	#[Route('/{activitySlug}/profits/{simulationToken}', name: 'app_professional_incomes', methods: ['GET'])]
	public function professionalIncomes(string $activitySlug, ?string $simulationToken = null): Response
	{
		$currentUser = $this->userService->getCurrentUser();
		$simulationData = $this->simulationRepository->findLastSimulationDataByActivity($activitySlug, $simulationToken, $currentUser);
		if (!$simulationData || !\is_array($simulationData)) {
			return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
		}

		if ($simulationData['token'] === 'default' && !$this->isGranted('ROLE_ADMIN')) {
			try {
				$simulation = $this->simulationService->createSimulation($activitySlug);
				$simulationData['id'] = $simulation->getId();
				$simulationData['token'] = $simulation->getToken();
			} catch (\Exception $e) {
				return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
			}
		}

		// if (!$simulationToken || ($simulationToken === 'default' && !$this->isGranted('ROLE_ADMIN'))) {
		// 	return $this->redirectToRoute('app_professional_incomes', [
		// 		'activitySlug' => $activitySlug,
		// 		'simulationToken' => $simulationData['token'],
		// 	]);
		// }

		$activity = $this->activityRepository->findOneBySlug($activitySlug);

		return $this->render('home/professional_incomes.html.twig', ['simulationId' => $simulationData['id'], 'simulationToken' => $simulationData['token'], 'activitySlug' => $activitySlug ?? $activity->getSlug(), 'activity' => $activity]);
	}

	#[Route('/{activitySlug}/charges/{simulationToken}', name: 'app_professional_expenses', methods: ['GET'])]
	public function professionalExpenses(string $activitySlug, ?string $simulationToken = null): Response
	{
		$currentUser = $this->userService->getCurrentUser();
		$simulationData = $this->simulationRepository->findLastSimulationDataByActivity($activitySlug, $simulationToken, $currentUser);
		if (!$simulationData || !\is_array($simulationData)) {
			return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
		}

		if ($simulationData['token'] === 'default' && !$this->isGranted('ROLE_ADMIN')) {
			try {
				$simulation = $this->simulationService->createSimulation($activitySlug);
				$simulationData['id'] = $simulation->getId();
				$simulationData['token'] = $simulation->getToken();
			} catch (\Exception $e) {
				return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
			}
		}

		// if (!$simulationToken || ($simulationToken === 'default' && !$this->isGranted('ROLE_ADMIN'))) {
		// 	return $this->redirectToRoute('app_professional_expenses', [
		// 		'activitySlug' => $activitySlug,
		// 		'simulationToken' => $simulationData['token'],
		// 	]);
		// }

		$activity = $this->activityRepository->findOneBySlug($activitySlug);

		return $this->render('home/professional_expenses.html.twig', ['simulationId' => $simulationData['id'], 'simulationToken' => $simulationData['token'], 'activitySlug' => $activitySlug ?? $activity->getSlug(), 'activity' => $activity]);
	}

	#[Route('/{activitySlug}/niveau-de-vie/{simulationToken}', name: 'app_personal_flows', methods: ['GET'])]
	public function personalIncomesExpenses(string $activitySlug, ?string $simulationToken = null): Response
	{
		$currentUser = $this->userService->getCurrentUser();
		$simulationData = $this->simulationRepository->findLastSimulationDataByActivity($activitySlug, $simulationToken, $currentUser);
		if (!$simulationData || !\is_array($simulationData)) {
			return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
		}

		if ($simulationData['token'] === 'default' && !$this->isGranted('ROLE_ADMIN')) {
			try {
				$simulation = $this->simulationService->createSimulation($activitySlug);
				$simulationData['id'] = $simulation->getId();
				$simulationData['token'] = $simulation->getToken();
			} catch (\Exception $e) {
				return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
			}
		}

		// if (!$simulationToken || ($simulationToken === 'default' && !$this->isGranted('ROLE_ADMIN'))) {
		// 	return $this->redirectToRoute('app_personal_flows', [
		// 		'activitySlug' => $activitySlug,
		// 		'simulationToken' => $simulationData['token'],
		// 	]);
		// }

		$activity = $this->activityRepository->findOneBySlug($activitySlug);

		return $this->render('home/personal_flows.html.twig', ['simulationId' => $simulationData['id'], 'simulationToken' => $simulationData['token'], 'activitySlug' => $activitySlug ?? $activity->getSlug(), 'activity' => $activity]);
	}

	#[Route('/{activitySlug}/{simulationToken}', name: 'app_home', methods: ['GET'], requirements: ['activitySlug' => '^(?!activity|blog|admin|financial-item|inscription|verify|reset-password|connexion|deconnexion|simulation|mentions-legales|protection-des-donnees-personnelles|image)[a-z-]+$'])]
	public function profitability(string $activitySlug = '', ?string $simulationToken = null): Response
	{
		$activity = $this->activityRepository->findOneBySlug($activitySlug);
		if (!$activity) {
			$defaultActivity = $this->activityRepository->findOneBy(['slug' => 'devenir-independant']);
			if (!$defaultActivity) {
				throw new NotFoundHttpException('Activity not found');
			}
			$activitySlug = $defaultActivity->getSlug();
			$activity = $defaultActivity;
		}

		$currentUser = $this->userService->getCurrentUser();
		$simulationData = $this->simulationRepository->findLastSimulationDataByActivity($activitySlug ?? '', $simulationToken, $currentUser);
		if (!$simulationData || !\is_array($simulationData)) {
			return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
		}

		if ($simulationData['token'] === 'default' && !$this->isGranted('ROLE_ADMIN')) {
			try {
				$simulation = $this->simulationService->createSimulation($activitySlug ?? '');
				$simulationData['id'] = $simulation->getId();
				$simulationData['token'] = $simulation->getToken();
			} catch (\Exception $e) {
				return $this->redirectToRoute('app_home', ['activitySlug' => $activitySlug]);
			}
		}

		// if (!$simulationToken || ($simulationToken === 'default' && !$this->isGranted('ROLE_ADMIN'))) {
		// 	return $this->redirectToRoute('app_home', [
		// 		'activitySlug' => $activitySlug,
		// 		'simulationToken' => $simulationData['token'],
		// 	]);
		// }

		return $this->render('home/index.html.twig', ['simulationId' => $simulationData['id'], 'simulationToken' => $simulationData['token'], 'activitySlug' => $activitySlug ?? $activity->getSlug(), 'activity' => $activity]);
	}
}

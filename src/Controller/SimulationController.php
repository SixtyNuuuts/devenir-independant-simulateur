<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Entity\Simulation;
use App\Entity\AnonymousUser;
use App\Security\UserService;
use App\Service\SimulationService;
use App\Repository\ActivityRepository;
use App\Repository\SimulationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/simulation')]
class SimulationController extends AbstractController
{
	public function __construct(
		private UserService $userService,
		private EntityManagerInterface $em,
		private SimulationRepository $simulationRepository,
		private SimulationService $simulationService,
	) {
	}

	#[Route('/get/{id}', name: 'app_simulation_get', methods: ['GET'])]
	public function get(int $id): JsonResponse
	{
		try {
			$simulationData = $this->simulationRepository->findSimulationByIdAsArray($id);
			if (!$simulationData) {
				return $this->json(['error' => 'la Simulation n\'existe pas !'], JsonResponse::HTTP_BAD_REQUEST);
			}

			return $this->json($simulationData, JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/list', name: 'app_simulation_list', methods: ['GET'])]
	public function list(Request $request): JsonResponse
	{
		try {
			$activitySlug = $request->query->get('activitySlug');
			$userType = $request->query->get('userType');
			$userId = $request->query->getInt('userId', 0);
			$page = $request->query->getInt('page', 1);
			$pageSize = $request->query->getInt('pageSize', 30);

			$user = null;
			if ($userType && $userId) {
				$repositoryClass = $userType === 'user' ? User::class : ($userType === 'anonymousUser' ? AnonymousUser::class : null);
				if ($repositoryClass) {
					$user = $this->em->getRepository($repositoryClass)->find($userId) ?? '---';
				}
			}

			$simulationsData = $this->simulationRepository->findSimulationsDataByCriteriaWithPagination($activitySlug, $user, $page, $pageSize);

			return $this->json($simulationsData, JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/create', name: 'app_simulation_create', methods: ['POST'])]
	public function create(Request $request, ActivityRepository $activityRepository): JsonResponse
	{
		$data = json_decode($request->getContent(), true);
		if (!$data || !\is_array($data)) {
			return $this->json(['error' => 'Données invalides'], JsonResponse::HTTP_BAD_REQUEST);
		}

		try {
			$activitySlug = $data['activitySlug'] ?? null;
			if (!$activitySlug) {
				return $this->json(['error' => 'activitySlug manquant'], JsonResponse::HTTP_BAD_REQUEST);
			}

			$simulation = $this->simulationService->createSimulation($activitySlug);

			return $this->json(['success' => 'Simulation créée !', 'token' => $simulation->getToken()], JsonResponse::HTTP_CREATED);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/update/{id}', name: 'app_simulation_update', methods: ['PATCH'])]
	public function update(Request $request, Simulation $simulation): JsonResponse
	{
		$data = json_decode($request->getContent(), true);
		if (!$data || !\is_array($data)) {
			return $this->json(['error' => 'Données invalides'], JsonResponse::HTTP_BAD_REQUEST);
		}

		try {
			// Admin --> $simulation->setToken

			$this->em->flush();

			return $this->json(['success' => 'Simulation mise à jour !'], JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/delete/{id}', name: 'app_simulation_delete', methods: ['DELETE', 'POST'])]
	public function delete(Simulation $simulation, Request $request): JsonResponse
	{
		$currentUser = $this->userService->getCurrentUser();
		$isAdmin = $this->isGranted('ROLE_ADMIN');
		$isOwner = $simulation->getUser() === $currentUser;

		if (!$isAdmin && !$isOwner) {
			return $this->json(['error' => 'Vous n\'êtes pas autorisé à supprimer cette simulation.'], JsonResponse::HTTP_FORBIDDEN);
		}

		try {
			if ($this->isCsrfTokenValid('DELETE' . $simulation->getId(), (string) $request->request->get('_token'))) {
				$this->em->remove($simulation);
				$this->em->flush();
			}

			return $this->json(['success' => 'Simulation supprimée !'], JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}
}

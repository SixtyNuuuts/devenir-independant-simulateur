<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\AnonymousUser;
use App\Entity\Simulation;
use App\Entity\User;
use App\Repository\ActivityRepository;
use App\Repository\SimulationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/simulation')]
class SimulationController extends AbstractController
{
	public function __construct(
		private EntityManagerInterface $em,
		private SimulationRepository $simulationRepository,
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
				$repositoryClass = $userType === 'User' ? User::class : ($userType === 'AnonymousUser' ? AnonymousUser::class : null);
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
			$activity = $activityRepository->findOneBy(['slug' => $data['activitySlug'] ?? null]);
			if (!$activity) {
				return $this->json(['error' => 'Activité non trouvée'], JsonResponse::HTTP_BAD_REQUEST);
			}

			$simulation = new Simulation();
			$simulation->setActivity($activity);

			$this->em->persist($simulation);
			$this->em->flush();

			return $this->json(['success' => 'Simulation créée !'], JsonResponse::HTTP_CREATED);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/update/{id}', name: 'app_simulation_update', methods: ['PUT'])]
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

	#[Route('/delete/{id}', name: 'app_simulation_delete', methods: ['DELETE'])]
	public function delete(Simulation $simulation): JsonResponse
	{
		try {
			$this->em->remove($simulation);
			$this->em->flush();

			return $this->json(['success' => 'Simulation supprimée !'], JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}
}

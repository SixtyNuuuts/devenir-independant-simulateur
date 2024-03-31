<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Simulation;
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
	public function get(Simulation $simulation): JsonResponse
	{
		try {
			return $this->json($simulation, JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/list', name: 'simulation_list', methods: ['GET'])]
	public function list(): JsonResponse
	{
		$simulations = $this->simulationRepository->findAll();

		return $this->json($simulations);
	}

	#[Route('/create', name: 'app_simulation_create', methods: ['POST'])]
	public function create(Request $request): JsonResponse
	{
		$data = json_decode($request->getContent(), true);
		if (!$data || !\is_array($data)) {
			return $this->json(['error' => 'Données invalides'], JsonResponse::HTTP_BAD_REQUEST);
		}

		$simulationTargetSalary = \is_string($data['target_salary'] ?? null) ? $data['target_salary'] : '2000.00';

		try {
			$simulation = new Simulation();
			// Admin --> $simulation->setToken('default');
			$simulation->setTargetSalary($simulationTargetSalary);

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

		$simulationTargetSalary = \is_string($data['target_salary'] ?? null) ? $data['target_salary'] : $simulation->getTargetSalary() ?? '2000.00';

		try {
			$simulation->setTargetSalary($simulationTargetSalary);

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

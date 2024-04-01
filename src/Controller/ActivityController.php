<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Activity;
use App\Repository\ActivityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/activity')]
class ActivityController extends AbstractController
{
	public function __construct(
		private EntityManagerInterface $em,
		private ActivityRepository $activityRepository,
	) {
	}

	#[Route('/get/{id}', name: 'app_activity_get', methods: ['GET'])]
	public function get(int $id): JsonResponse
	{
		try {
			$activityData = $this->activityRepository->findActivityByIdAsArray($id);
			if (!$activityData) {
				return $this->json(['error' => 'l\'Activité n\'existe pas !'], JsonResponse::HTTP_BAD_REQUEST);
			}

			return $this->json($activityData, JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/list', name: 'app_activity_list', methods: ['GET'])]
	public function list(): JsonResponse
	{
		try {
			$activitiesData = $this->activityRepository->findAllActivitiesAsArray();

			return $this->json($activitiesData, JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/create', name: 'app_activity_create', methods: ['POST'])]
	public function create(Request $request): JsonResponse
	{
		$data = json_decode($request->getContent(), true);
		if (!$data || !\is_array($data)) {
			return $this->json(['error' => 'Données invalides'], JsonResponse::HTTP_BAD_REQUEST);
		}

		$activityName = \is_string($data['name'] ?? null) ? $data['name'] : '---';
		$activitySlug = \is_string($data['slug'] ?? null) ? $data['slug'] : '---';
		$activitySummary = \is_string($data['summary'] ?? null) ? $data['summary'] : '---';
		$activityDescription = \is_string($data['description'] ?? null) ? $data['description'] : '---';
		$activityBannerImage = \is_string($data['bannerImage'] ?? null) ? $data['bannerImage'] : '/';

		try {
			$activity = new Activity();
			$activity->setName($activityName);
			$activity->setSlug($activitySlug);
			$activity->setSummary($activitySummary);
			$activity->setDescription($activityDescription);
			$activity->setBannerImage($activityBannerImage);

			$this->em->persist($activity);
			$this->em->flush();

			return $this->json(['success' => 'Activité créée !'], JsonResponse::HTTP_CREATED);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/update/{id}', name: 'app_activity_update', methods: ['PUT'])]
	public function update(Request $request, Activity $activity): JsonResponse
	{
		$data = json_decode($request->getContent(), true);
		if (!$data || !\is_array($data)) {
			return $this->json(['error' => 'Données invalides'], JsonResponse::HTTP_BAD_REQUEST);
		}

		$activityName = \is_string($data['name'] ?? null) ? $data['name'] : $activity->getName() ?? '---';
		$activitySlug = \is_string($data['slug'] ?? null) ? $data['slug'] : $activity->getSlug() ?? '---';
		$activitySummary = \is_string($data['summary'] ?? null) ? $data['summary'] : $activity->getSummary() ?? '---';
		$activityDescription = \is_string($data['description'] ?? null) ? $data['description'] : $activity->getDescription() ?? '---';
		$activityBannerImage = \is_string($data['bannerImage'] ?? null) ? $data['bannerImage'] : $activity->getBannerImage() ?? '/';

		try {
			$activity->setName($activityName);
			$activity->setSlug($activitySlug);
			$activity->setSummary($activitySummary);
			$activity->setDescription($activityDescription);
			$activity->setBannerImage($activityBannerImage);

			$this->em->flush();

			return $this->json(['success' => 'Activité mise à jour !'], JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/delete/{id}', name: 'app_activity_delete', methods: ['DELETE'])]
	public function delete(Activity $activity): JsonResponse
	{
		try {
			$this->em->remove($activity);
			$this->em->flush();

			return $this->json(['success' => 'Activité supprimée !'], JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}
}

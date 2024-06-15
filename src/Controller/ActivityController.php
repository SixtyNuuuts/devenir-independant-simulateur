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
use Symfony\Component\Security\Http\Attribute\IsGranted;

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

	#[IsGranted('ROLE_ADMIN')]
	#[Route('/create', name: 'app_activity_create', methods: ['POST'])]
	public function create(Request $request): JsonResponse
	{
		$data = json_decode($request->getContent(), true);
		if (!$data || !\is_array($data)) {
			return $this->json(['error' => 'Données invalides'], JsonResponse::HTTP_BAD_REQUEST);
		}

		$activityName = \is_string($data['name'] ?? null) ? $data['name'] : '---';
		$activitySlug = \is_string($data['slug'] ?? null) ? $data['slug'] : '---';
		$activityTitle = \is_string($data['title'] ?? null) ? $data['title'] : '---';
		$activityObjectives = \is_array($data['objectives'] ?? null) ? $data['objectives'] : [];
		$activityDescription = \is_string($data['description'] ?? null) ? $data['description'] : '---';
		$activityDetailedDescription = \is_string($data['detailed_description'] ?? null) ? $data['detailed_description'] : '---';
		$activityMobileImage = \is_string($data['mobileImage'] ?? null) ? $data['mobileImage'] : '/';
		$activityDesktopImage = \is_string($data['desktopImage'] ?? null) ? $data['desktopImage'] : '/';

		try {
			$activity = new Activity();
			$activity->setName($activityName);
			$activity->setSlug($activitySlug);
			$activity->setTitle($activityTitle);
			$activity->setObjectives($activityObjectives);
			$activity->setDescription($activityDescription);
			$activity->setDetailedDescription($activityDetailedDescription);
			$activity->setMobileImage($activityMobileImage);
			$activity->setDesktopImage($activityDesktopImage);

			$this->em->persist($activity);
			$this->em->flush();

			return $this->json(['success' => 'Activité créée !', 'id' => $activity->getId()], JsonResponse::HTTP_CREATED);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[IsGranted('ROLE_ADMIN')]
	#[Route('/update/{id}', name: 'app_activity_update', methods: ['PATCH'])]
	public function update(Request $request, Activity $activity): JsonResponse
	{
		$data = json_decode($request->getContent(), true);
		if (!$data || !\is_array($data)) {
			return $this->json(['error' => 'Données invalides'], JsonResponse::HTTP_BAD_REQUEST);
		}

		$activityName = \is_string($data['name'] ?? null) ? $data['name'] : $activity->getName() ?? '---';
		$activitySlug = \is_string($data['slug'] ?? null) ? $data['slug'] : $activity->getSlug() ?? '---';
		$activityTitle = \is_string($data['title'] ?? null) ? $data['title'] : $activity->getTitle() ?? '---';
		$activityObjectives = \is_array($data['objectives'] ?? null) ? $data['objectives'] : $activity->getObjectives() ?? [];
		$activityDescription = \is_string($data['description'] ?? null) ? $data['description'] : $activity->getDescription() ?? '---';
		$activityDetailedDescription = \is_string($data['detailed_description'] ?? null) ? $data['detailed_description'] : $activity->getDetailedDescription() ?? '---';
		$activityMobileImage = \is_string($data['mobileImage'] ?? null) ? $data['mobileImage'] : $activity->getMobileImage() ?? '/';
		$activityDesktopImage = \is_string($data['desktopImage'] ?? null) ? $data['desktopImage'] : $activity->getDesktopImage() ?? '/';

		try {
			$activity->setName($activityName);
			$activity->setSlug($activitySlug);
			$activity->setTitle($activityTitle);
			$activity->setObjectives($activityObjectives);
			$activity->setDescription($activityDescription);
			$activity->setDetailedDescription($activityDetailedDescription);
			$activity->setMobileImage($activityMobileImage);
			$activity->setDesktopImage($activityDesktopImage);

			$this->em->flush();

			return $this->json(['success' => 'Activité mise à jour !'], JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[IsGranted('ROLE_ADMIN')]
	#[Route('/delete/{id}', name: 'app_activity_delete', methods: ['DELETE', 'POST'])]
	public function delete(Activity $activity, Request $request): JsonResponse
	{
		try {
			if ($this->isCsrfTokenValid('DELETE' . $activity->getId(), (string) $request->request->get('_token'))) {
				$this->em->remove($activity);
				$this->em->flush();
			}

			return $this->json(['success' => 'Activité supprimée !'], JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}
}

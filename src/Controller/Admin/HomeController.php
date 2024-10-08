<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Entity\User;
use App\Entity\Activity;
use App\Entity\Simulation;
use App\Entity\AnonymousUser;
use App\Entity\FinancialItem;
use App\Security\UserService;
use App\Enum\FinancialItemType;
use Symfony\Component\Yaml\Yaml;
use App\Enum\FinancialItemNature;
use App\Repository\SimulationRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\AnonymousUserRepository;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/admin')]
#[IsGranted('ROLE_ADMIN')]
class HomeController extends AbstractController
{
	private User|AnonymousUser $user;

	public function __construct(
		private UserService $userService,
	) {
		$this->user = $this->userService->getCurrentUser();
	}

	#[Route('/', name: 'app_admin_home')]
	public function index(EntityManagerInterface $entityManager, PaginatorInterface $paginator, Request $request): Response
	{
		$activityRepo = $entityManager->getRepository(Activity::class);
		$simulationRepo = $entityManager->getRepository(Simulation::class);

		$queryActivities = $activityRepo->createQueryBuilder('a')->getQuery();
		$querySimulations = $simulationRepo->createQueryBuilder('s')
			->where('s.token != :defaultToken')
			->setParameter('defaultToken', 'default')
			->orderBy('s.createdAt', 'DESC')
			->getQuery();

		$pageActivities = $request->query->getInt('page_activities', 1);
		$pageSimulations = $request->query->getInt('page_simulations', 1);

		$paginationActivities = $paginator->paginate($queryActivities, $pageActivities, 25, [
			'pageParameterName' => 'page_activities',
		]);
		$paginationSimulations = $paginator->paginate($querySimulations, $pageSimulations, 25, [
			'pageParameterName' => 'page_simulations',
		]);

		// Requêtes pour compter les entités
		$totalActivities = $activityRepo->createQueryBuilder('a')
			->select('count(a.id)')
			->getQuery()
			->getSingleScalarResult();

		$totalSimulations = $simulationRepo->createQueryBuilder('s')
			->select('count(s.id)')
			->where('s.token != :defaultToken')
			->setParameter('defaultToken', 'default')
			->getQuery()
			->getSingleScalarResult();

		return $this->render('admin/index.html.twig', [
			'paginationActivities' => $paginationActivities,
			'paginationSimulations' => $paginationSimulations,
			'totalActivities' => $totalActivities,
			'totalSimulations' => $totalSimulations,
		]);
	}

	#[Route('/import/{importOverwrite}', name: 'app_admin_import', methods: ['GET', 'POST'])]
	public function import(Request $request, EntityManagerInterface $entityManager, ?string $importOverwrite = null): JsonResponse|Response
	{
		if (!empty($this->user) && $request->isMethod('POST')) {
			$file = $request->files->get('file');

			if (!$file || !($file instanceof UploadedFile) || !file_exists($file->getPathname())) {
				return $this->json(['error' => 'Fichier non trouvé.'], Response::HTTP_BAD_REQUEST);
			}

			$yamlContent = file_get_contents($file->getPathname());
			if (false === $yamlContent) {
				return $this->json(['error' => 'Fichier yaml non conforme.'], Response::HTTP_BAD_REQUEST);
			}

			$data = Yaml::parse($yamlContent);
			if (!\is_array($data) || !isset($data['activity']) || !\is_array($data['activity']) || !isset($data['professional_income']) || !isset($data['professional_expense']) || !isset($data['personal_expense']) || !isset($data['salary_current']) || !isset($data['salary_target'])) {
				return $this->json(['error' => 'Le fichier ne contient pas les données nécessaires pour l\'import (activity, professional_income, professional_expense, personal_expense, salary_current, salary_target).'], Response::HTTP_BAD_REQUEST);
			}

			$activitySlug = \is_string($data['activity']['slug'] ?? null) ? $data['activity']['slug'] : null;
			if (!$activitySlug) {
				return $this->json(['error' => 'L\'activité n\'a pas de slug.'], Response::HTTP_BAD_REQUEST);
			}

			$activity = $entityManager->getRepository(Activity::class)->findOneBy(['slug' => $activitySlug]);
			if ($activity && (!$importOverwrite || 'overwrite' !== $importOverwrite)) {
				return $this->json(['warning' => "Une activité avec le slug '{$activitySlug}' existe déjà. Les données vont être écrasées. Souhaitez-vous continuer ?"], Response::HTTP_CONFLICT);
			}

			$entityManager->beginTransaction();
			try {
				if ($activity) {
					$simulation = $entityManager->getRepository(Simulation::class)->findOneBy([
						'activity' => $activity,
						'token' => 'default',
					]);

					if ($simulation) {
						$financialItems = $simulation->getFinancialItems();
						foreach ($financialItems as $financialItem) {
							$entityManager->remove($financialItem);
						}
					}
				}

				$activityName = \is_string($data['activity']['name'] ?? null) ? $data['activity']['name'] : '---';
				$activitySlug = \is_string($data['activity']['slug'] ?? null) ? $data['activity']['slug'] : '---';
				$activityGoal = \is_string($data['activity']['goal'] ?? null) ? $data['activity']['goal'] : '---';
				$activityTitle = \is_string($data['activity']['title'] ?? null) ? $data['activity']['title'] : '---';
				$activityObjectives = \is_array($data['activity']['objectives'] ?? null) ? $data['activity']['objectives'] : [];
				$activityDescription = \is_string($data['activity']['description'] ?? null) ? $data['activity']['description'] : '---';
				$activityDetailedDescription = \is_string($data['activity']['detailed_description'] ?? null) ? $data['activity']['detailed_description'] : '---';

				$activity ??= new Activity();
				$activity->setName($activityName)
					->setSlug($activitySlug)
					->setGoal($activityGoal)
					->setTitle($activityTitle)
					->setObjectives($activityObjectives)
					->setDescription($activityDescription)
					->setDetailedDescription($activityDetailedDescription)
					->setMobileImage($activity->getMobileImage() ?? '/')
					->setDesktopImage($activity->getDesktopImage() ?? '/');

				$entityManager->persist($activity);

				$simulation ??= new Simulation();
				$simulation->setActivity($activity)
					->setToken('default');
				$entityManager->persist($simulation);

				$this->processFinancialItems($data, $simulation, $entityManager);

				$entityManager->flush();
				$entityManager->commit();

				return $this->json(['success' => 'Les données ont été importées avec succès.'], Response::HTTP_OK);
			} catch (\Exception $e) {
				$entityManager->rollback();

				return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
			}
		}

		return $this->render('admin/import.html.twig');
	}

	#[Route('/clean', name: 'app_admin_clean', methods: ['POST'])]
	public function clean(EntityManagerInterface $entityManager, SimulationRepository $simulationRepository, AnonymousUserRepository $anonymousUserRepository): Response
	{
		$simulations = $simulationRepository->createQueryBuilder('s')
			->andWhere('s.token != :defaultToken')
			->setParameter('defaultToken', 'default')
			->getQuery()
			->getResult();

		$countDeletedSimulations = 0;
		foreach ($simulations as $simulation) {
			if ($simulation->getUpdatedAt() == $simulation->getCreatedAt()) {
				$entityManager->remove($simulation);
				$countDeletedSimulations++;
			}
		}

		$entityManager->flush();

		$anonymousUsers = $anonymousUserRepository->createQueryBuilder('u')
			->leftJoin('u.simulations', 's')
			->where('s.id IS NULL')
			->getQuery()
			->getResult();

		$countDeletedAnonymousUser = 0;
		foreach ($anonymousUsers as $anonymousUser) {
			$entityManager->remove($anonymousUser);
			$countDeletedAnonymousUser++;
		}

		$entityManager->flush();

		// Afficher les résultats dans la réponse
		return $this->json(['success' => 'Nettoyage terminé, Résultats: ' . $countDeletedSimulations . ' simulations supprimées et ' . $countDeletedAnonymousUser . ' utilisateurs anonymes supprimés'], Response::HTTP_OK);
	}

	/**
	 * @param array<mixed> $data
	 */
	private function processFinancialItems(array $data, Simulation $simulation, EntityManagerInterface $entityManager): void
	{
		foreach (['professional_income', 'professional_expense', 'personal_income', 'personal_expense', 'salary_current', 'salary_target'] as $financialItemType) {
			if (!isset($data[$financialItemType]) || !\is_array($data[$financialItemType])) {
				continue;
			}
			foreach ($data[$financialItemType] as $financialItemData) {
				if (!\is_array($financialItemData)) {
					continue;
				}
				[$nature, $type] = explode('_', $financialItemType);
				$financialItem = $this->createFinancialItem($financialItemData, $nature, $type);
				$entityManager->persist($financialItem);
				$simulation->addFinancialItem($financialItem);
			}
		}
	}

	/**
	 * @param array<mixed> $data
	 */
	private function createFinancialItem(array $data, string $nature, string $type): FinancialItem
	{
		$financialItem = new FinancialItem();

		$financialItemName = \is_string($data['name'] ?? null) ? $data['name'] : '---';
		$financialItemValue = is_numeric($data['value'] ?? null) ? (string) $data['value'] : '0.00';
		$financialItemAttributes = \is_array($data['attributes'] ?? null) ? $data['attributes'] : [];

		$financialItem->setName($financialItemName)
			->setValue($financialItemValue)
			->setAttributes($financialItemAttributes)
			->setNature(FinancialItemNature::from($nature))
			->setType(FinancialItemType::from($type));

		return $financialItem;
	}
}

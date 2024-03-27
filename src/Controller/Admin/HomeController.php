<?php

namespace App\Controller\Admin;

use App\Entity\Activity;
use App\Entity\AnonymousUser;
use App\Entity\FinancialItem;
use App\Entity\Simulation;
use App\Entity\User;
use App\Enum\FinancialItemNature;
use App\Enum\FinancialItemType;
use App\Security\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Yaml\Yaml;

#[Route('/admin')]
class HomeController extends AbstractController
{
    private User|AnonymousUser $user;

    public function __construct(
        private UserService $userService,
    ) {
        $this->user = $this->userService->getCurrentUser();
    }

    #[Route('/', name: 'app_admin_home')]
    public function index(): Response
    {
        return $this->render('admin/index.html.twig');
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
            if (!\is_array($data) || !isset($data['simulation']) || !\is_array($data['simulation']) || !isset($data['activity']) || !\is_array($data['activity']) || !isset($data['professional_income']) || !isset($data['professional_expense']) || !isset($data['personal_income']) || !isset($data['personal_expense'])) {
                return $this->json(['error' => 'Le fichier ne contient pas les données nécessaires pour l\'import (activity, simulation, professional_income, professional_expense, personal_income, personal_expense).'], Response::HTTP_BAD_REQUEST);
            }

            $activitySlug = \is_string($data['activity']['slug'] ?? null) ? $data['activity']['slug'] : null;
            if (!$activitySlug) {
                return $this->json(['error' => 'L\'activité n\'a pas de slug.'], Response::HTTP_BAD_REQUEST);
            }

            $activity = $entityManager->getRepository(Activity::class)->findOneBy(['slug' => $activitySlug]);
            if ($activity && (!$importOverwrite || 'overwrite' != $importOverwrite)) {
                return $this->json(['warning' => "Une activité avec le slug '$activitySlug' existe déjà. Les données vont être écrasées. Souhaitez-vous continuer ?"], Response::HTTP_CONFLICT);
            }

            $entityManager->beginTransaction();
            try {
                if ($activity) {
                    $simulation = $entityManager->getRepository(Simulation::class)->findOneBy([
                        'activity' => $activity,
                        'token'    => 'default',
                    ]);

                    if ($simulation) {
                        $financialItems = $simulation->getFinancialItems();
                        foreach ($financialItems as $financialItem) {
                            $entityManager->remove($financialItem);
                        }
                    }
                }

                $activityName        = \is_string($data['activity']['name'] ?? null) ? $data['activity']['name'] : '---';
                $activitySummary     = \is_string($data['activity']['summary'] ?? null) ? $data['activity']['summary'] : '---';
                $activityDescription = \is_string($data['activity']['description'] ?? null) ? $data['activity']['description'] : '---';

                $activity ??= new Activity();
                $activity->setName($activityName)
                    ->setSlug($activitySlug)
                    ->setSummary($activitySummary)
                    ->setDescription($activityDescription)
                    ->setBannerImage($activity->getBannerImage() ?? '/');
                $entityManager->persist($activity);

                $simulationToken        = \is_string($data['simulation']['token'] ?? null) ? $data['simulation']['token'] : '---';
                $simulationTargetSalary = \is_string($data['simulation']['target_salary'] ?? null) ? $data['simulation']['target_salary'] : '2600.00';

                $simulation ??= new Simulation();
                $simulation->setActivity($activity)
                    ->setToken($simulationToken)
                    ->setTargetSalary($simulationTargetSalary);
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

    /**
     * @param array<mixed> $data
     */
    private function processFinancialItems(array $data, Simulation $simulation, EntityManagerInterface $entityManager): void
    {
        foreach (['professional_income', 'professional_expense', 'personal_income', 'personal_expense'] as $financialItemType) {
            if (!\is_array($data[$financialItemType])) {
                continue;
            }
            foreach ($data[$financialItemType] as $financialItemData) {
                if (!\is_array($financialItemData)) {
                    continue;
                }
                [$nature, $type] = explode('_', $financialItemType);
                $financialItem   = $this->createFinancialItem($financialItemData, $nature, $type);
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

        $financialItemName       = \is_string($data['name'] ?? null) ? $data['name'] : '---';
        $financialItemValue      = is_numeric($data['value'] ?? null) ? (string) $data['value'] : '0.00';
        $financialItemAttributes = \is_array($data['attributes'] ?? null) ? $data['attributes'] : [];

        $financialItem->setName($financialItemName)
            ->setValue($financialItemValue)
            ->setAttributes($financialItemAttributes)
            ->setNature(FinancialItemNature::from($nature))
            ->setType(FinancialItemType::from($type));

        return $financialItem;
    }
}

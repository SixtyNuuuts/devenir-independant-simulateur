<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\FinancialItem;
use App\Enum\FinancialItemNature;
use App\Enum\FinancialItemType;
use App\Repository\FinancialItemRepository;
use App\Repository\SimulationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/financial-item')]
class FinancialItemController extends AbstractController
{
	public function __construct(
		private EntityManagerInterface $em,
		private SimulationRepository $simulationRepository,
		private FinancialItemRepository $financialItemRepository,
	) {
	}

	#[Route('/get/{id}', name: 'app_financial-item_get', methods: ['GET'])]
	public function get(int $id): JsonResponse
	{
		try {
			$financialItemData = $this->financialItemRepository->findFinancialItemByIdAsArray($id);
			if (!$financialItemData) {
				return $this->json(['error' => 'le FinancialItem n\'existe pas !'], JsonResponse::HTTP_BAD_REQUEST);
			}

			return $this->json($financialItemData, JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/list/{simulationId}/{financialItemNature}/{financialItemType}', name: 'app_financial-item_list', methods: ['GET'])]
	public function list(?string $financialItemNature = null, ?string $financialItemType = null, ?int $simulationId = null): JsonResponse
	{
		try {
			$financialItemNatureEnum = $financialItemNature !== null ? FinancialItemNature::tryFrom($financialItemNature) : null;
			$financialItemTypeEnum = $financialItemType !== null ? FinancialItemType::tryFrom($financialItemType) : null;

			$simulation = $this->simulationRepository->findOneBy(['id' => $simulationId]);
			if (!$simulation) {
				return $this->json(['error' => 'la Simulation n\'existe pas !'], JsonResponse::HTTP_BAD_REQUEST);
			}
			$financialItemsData = $this->financialItemRepository->findFinancialItemsDataByCriteria($simulation, $financialItemNatureEnum, $financialItemTypeEnum);

			switch (true) {
				case $financialItemNatureEnum === FinancialItemNature::PROFESSIONAL && $financialItemTypeEnum === FinancialItemType::EXPENSE:
					$salaryTarget = $this->financialItemRepository->findFinancialItemsDataByCriteria($simulation, FinancialItemNature::SALARY, FinancialItemType::TARGET);

					if (isset($salaryTarget[0])) {
						$netSalary = isset($salaryTarget[0]['value']) ? (float) $salaryTarget[0]['value'] : 0.0;
						$employeeContributionRate = 0.30; // 30% to calculate brut salary
						$employerContributionRate = 0.13; // 13% to calculate total cost

						$brutSalary = ($netSalary * $employeeContributionRate) + $netSalary;
						$totalCompanyCost = ($brutSalary * $employerContributionRate) + $brutSalary;

						$totalCompanyCostItem = [
							'id' => 'total-company-cost',
							'name' => 'Cout total entreprise',
							'value' => $totalCompanyCost,
							'nature' => 'salary',
							'type' => 'total-company-cost',
							'attributes' => [],
						];

						$salaryTarget = [$totalCompanyCostItem];
					}
					$financialItemsData = array_merge($salaryTarget, $financialItemsData);
					break;
				case $financialItemNatureEnum === FinancialItemNature::PERSONAL && $financialItemTypeEnum === FinancialItemType::INCOME:
					$salaryCurrent = $this->financialItemRepository->findFinancialItemsDataByCriteria($simulation, FinancialItemNature::SALARY, FinancialItemType::CURRENT);
					$financialItemsData = array_merge($salaryCurrent, $financialItemsData);
					break;
				case $financialItemNatureEnum === FinancialItemNature::SALARY && $financialItemTypeEnum === FinancialItemType::TARGET:
					$salaryTarget = $financialItemsData[0]; // $salaryNet
					$employeeContributionRate = 0.30; // 30% to calculate brut salary
					$employerContributionRate = 0.13; // 13% to calculate total cost

					$netSalary = isset($salaryTarget['value']) ? (float) $salaryTarget['value'] : 0.0;
					$brutSalary = ($netSalary * $employeeContributionRate) + $netSalary;
					$totalCompanyCost = ($brutSalary * $employerContributionRate) + $brutSalary;

					$brutSalaryItem = [
						'id' => 'salary-brut',
						'name' => 'Salaire brut',
						'value' => $brutSalary,
						'nature' => 'salary',
						'type' => 'brut',
						'attributes' => [],
					];

					$totalCompanyCostItem = [
						'id' => 'salary-total-company-cost',
						'name' => 'Cout total entreprise',
						'value' => $totalCompanyCost,
						'nature' => 'salary',
						'type' => 'total-company-cost',
						'attributes' => [],
					];

					$financialItemsData[] = $brutSalaryItem;
					$financialItemsData[] = $totalCompanyCostItem;
					break;
			}

			return $this->json($financialItemsData, JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/create', name: 'app_financial-item_create', methods: ['POST'])]
	public function create(Request $request): JsonResponse
	{
		$data = json_decode($request->getContent(), true);
		if (!$data || !\is_array($data)) {
			return $this->json(['error' => 'Données invalides'], JsonResponse::HTTP_BAD_REQUEST);
		}

		$financialItemName = \is_string($data['name'] ?? null) ? $data['name'] : '---';
		$financialItemValue = is_numeric($data['value'] ?? null) ? (string) $data['value'] : '0.00';
		$financialItemNature = \is_string($data['nature'] ?? null) ? FinancialItemNature::from($data['nature']) : FinancialItemNature::DEFAULT;
		$financialItemType = \is_string($data['type'] ?? null) ? FinancialItemType::from($data['type']) : FinancialItemType::DEFAULT;
		$financialItemAttributes = \is_array($data['attributes'] ?? null) ? $data['attributes'] : [];
		$financialItemSimulation = is_numeric($data['simulation_id'] ?? null) ? $this->simulationRepository->findOneBy(['id' => $data['simulation_id']]) : null;

		try {
			$financialItem = new FinancialItem();
			$financialItem->setName($financialItemName);
			$financialItem->setValue($financialItemValue);
			$financialItem->setNature($financialItemNature);
			$financialItem->setType($financialItemType);
			$financialItem->setAttributes($financialItemAttributes);
			$financialItem->setSimulation($financialItemSimulation);

			$this->em->persist($financialItem);
			$this->em->flush();

			return $this->json(['success' => 'FinancialItem créé !', 'id' => $financialItem->getId()], JsonResponse::HTTP_CREATED);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/update/{id}', name: 'app_financial-item_update', methods: ['PATCH'])]
	public function update(Request $request, FinancialItem $financialItem): JsonResponse
	{
		$data = json_decode($request->getContent(), true);
		if (!$data || !\is_array($data)) {
			return $this->json(['error' => 'Données invalides'], JsonResponse::HTTP_BAD_REQUEST);
		}

		$financialItemName = \is_string($data['name'] ?? null) ? $data['name'] : $financialItem->getName() ?? '---';
		$financialItemValue = is_numeric($data['value'] ?? null) ? (string) $data['value'] : $financialItem->getValue() ?? '0.00';
		$financialItemNature = \is_string($data['nature'] ?? null) ? FinancialItemNature::from($data['nature']) : ($financialItem->getNature() ?? null);
		$financialItemType = \is_string($data['type'] ?? null) ? FinancialItemType::from($data['type']) : ($financialItem->getType() ?? null);
		$financialItemAttributes = \is_array($data['attributes'] ?? null) ? $data['attributes'] : $financialItem->getAttributes() ?? [];

		try {
			$financialItem->setName($financialItemName);
			$financialItem->setValue($financialItemValue);
			$financialItem->setNature($financialItemNature);
			$financialItem->setType($financialItemType);
			$financialItem->setAttributes($financialItemAttributes);
			$financialItem->getSimulation()->setUpdatedAt(new \DateTime());

			$this->em->flush();

			return $this->json(['success' => 'FinancialItem mis à jour !'], JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/delete/{id}', name: 'app_financial-item_delete', methods: ['DELETE'])]
	public function delete(FinancialItem $financialItem): JsonResponse
	{
		try {
			$this->em->remove($financialItem);
			$this->em->flush();

			return $this->json(['success' => 'FinancialItem supprimé !'], JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}
}

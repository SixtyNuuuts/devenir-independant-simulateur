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
		$financialItemNature = \is_string($data['nature'] ?? null) ? FinancialItemNature::from($data['nature']) : null;
		$financialItemType = \is_string($data['type'] ?? null) ? FinancialItemType::from($data['type']) : null;
		$financialItemAttributes = \is_array($data['attributes'] ?? null) ? $data['attributes'] : [];

		try {
			$financialItem = new FinancialItem();
			$financialItem->setName($financialItemName);
			$financialItem->setValue($financialItemValue);
			$financialItem->setNature($financialItemNature);
			$financialItem->setType($financialItemType);
			$financialItem->setAttributes($financialItemAttributes);

			$this->em->persist($financialItem);
			$this->em->flush();

			return $this->json(['success' => 'FinancialItem créé !'], JsonResponse::HTTP_CREATED);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}

	#[Route('/update/{id}', name: 'app_financial-item_update', methods: ['PUT'])]
	public function update(Request $request, FinancialItem $financialItem): JsonResponse
	{
		$data = json_decode($request->getContent(), true);
		if (!$data || !\is_array($data)) {
			return $this->json(['error' => 'Données invalides'], JsonResponse::HTTP_BAD_REQUEST);
		}

		$financialItemName = \is_string($data['name'] ?? null) ? $data['name'] : $financialItem->getName() ?? '---';
		$financialItemValue = is_numeric($data['value'] ?? null) ? (string) $data['value'] : $financialItem->getValue() ?? '0.00';
		$financialItemNature = \is_string($data['nature'] ?? null) ? FinancialItemNature::from($data['nature']) : $financialItem->getNature() ?? null;
		$financialItemType = \is_string($data['type'] ?? null) ? FinancialItemType::from($data['type']) : $financialItem->getType() ?? null;
		$financialItemAttributes = \is_array($data['attributes'] ?? null) ? $data['attributes'] : $financialItem->getAttributes() ?? [];

		try {
			$financialItem->setName($financialItemName);
			$financialItem->setValue($financialItemValue);
			$financialItem->setNature($financialItemNature);
			$financialItem->setType($financialItemType);
			$financialItem->setAttributes($financialItemAttributes);

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

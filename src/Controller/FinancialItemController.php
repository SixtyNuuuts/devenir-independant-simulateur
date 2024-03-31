<?php

declare(strict_types=1);

namespace App\Controller;

use App\Enum\FinancialItemNature;
use App\Enum\FinancialItemType;
use App\Repository\FinancialItemRepository;
use App\Repository\SimulationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/financial-item')]
class FinancialItemController extends AbstractController
{
	public function __construct(
		private SimulationRepository $simulationRepository,
		private FinancialItemRepository $financialItemRepository,
	) {
	}

	#[Route('/get/{financialItemNature}/{financialItemType}/{simulationId}', name: 'app_financial-item_get', methods: ['GET'])]
	public function professionalIncomes(string $financialItemNature, string $financialItemType, int $simulationId): JsonResponse
	{
		try {
			$financialItemNatureEnum = FinancialItemNature::tryFrom($financialItemNature);
			$financialItemTypeEnum = FinancialItemType::tryFrom($financialItemType);

			if (!$financialItemNatureEnum || !$financialItemTypeEnum) {
				throw new BadRequestHttpException('Valeur de paramètre non valide pour financialItemNature ou financialItemType');
			}

			$simulation = $this->simulationRepository->findOneBy(['id' => $simulationId]);
			$financialItemsData = $this->financialItemRepository->findFinancialItemsDataByCriteria($financialItemNatureEnum, $financialItemTypeEnum, $simulation);

			return $this->json($financialItemsData, JsonResponse::HTTP_OK);
		} catch (\Exception $exception) {
			return $this->json(['error' => $exception->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
		}
	}
}

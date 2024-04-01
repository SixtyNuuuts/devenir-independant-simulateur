<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\FinancialItem;
use App\Entity\Simulation;
use App\Enum\FinancialItemNature;
use App\Enum\FinancialItemType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FinancialItem>
 *
 * @method FinancialItem|null find($id, $lockMode = null, $lockVersion = null)
 * @method FinancialItem|null findOneBy(array $criteria, array $orderBy = null)
 * @method FinancialItem[]    findAll()
 * @method FinancialItem[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FinancialItemRepository extends ServiceEntityRepository
{
	public function __construct(ManagerRegistry $registry)
	{
		parent::__construct($registry, FinancialItem::class);
	}

	public function findFinancialItemByIdAsArray(int $id): mixed
	{
		$qb = $this->createQueryBuilder('fi');

		$query = $qb->select([
			'fi.id',
			'fi.name',
			'fi.value',
			'fi.nature',
			'fi.type',
			'fi.attributes',
		])
			->where('fi.id = :id')
			->setParameter('id', $id)
			->getQuery()
		;

		try {
			return $query->getOneOrNullResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
		} catch (\Doctrine\ORM\NonUniqueResultException $e) {
			return null;
		}
	}

	/**
	 * @return mixed[]
	 */
	public function findAllFinancialItemsAsArray(): array
	{
		$qb = $this->createQueryBuilder('fi');

		$query = $qb->select([
			'fi.id',
			'fi.name',
			'fi.value',
			'fi.nature',
			'fi.type',
			'fi.attributes',
		])
			->getQuery()
		;

		return $query->getArrayResult();
	}

	/**
	 * @return mixed[]
	 */
	public function findFinancialItemsDataByCriteria(?Simulation $simulation, ?FinancialItemNature $financialItemNature, ?FinancialItemType $financialItemType): array
	{
		$qb = $this->createQueryBuilder('fi');

		$qb->select([
			'fi.id',
			'fi.name',
			'fi.value',
			'fi.nature',
			'fi.type',
			'fi.attributes',
		]);

		if ($financialItemNature !== null) {
			$qb->andWhere('fi.nature = :nature')
				->setParameter('nature', $financialItemNature)
			;
		}

		if ($financialItemType !== null) {
			$qb->andWhere('fi.type = :type')
				->setParameter('type', $financialItemType)
			;
		}

		if ($simulation !== null) {
			$qb->andWhere('fi.simulation = :simulation')
				->setParameter('simulation', $simulation)
			;
		}

		$query = $qb->getQuery();

		return $query->getArrayResult();
	}
}

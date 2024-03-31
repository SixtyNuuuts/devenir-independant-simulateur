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

	/**
	 * @return mixed[]
	 */
	public function findFinancialItemsDataByCriteria(FinancialItemNature $financialItemNature, FinancialItemType $financialItemType, ?Simulation $simulation): array
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
			->where('fi.nature = :nature')
			->andWhere('fi.type = :type')
			->andWhere('fi.simulation = :simulation')
			->setParameter('nature', $financialItemNature)
			->setParameter('type', $financialItemType)
			->setParameter('simulation', $simulation)
			->getQuery()
		;

		return $query->getArrayResult();
	}
}

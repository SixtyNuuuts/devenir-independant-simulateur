<?php

namespace App\Repository;

use App\Entity\FinancialItem;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FinancialItem>
 *
 * @method FinancialItem|null find($id, $lockMode = null, $lockVersion = null)
 * @method FinancialItem|null findOneBy(array $criteria, array $orderBy = null)
 * @method FinancialItem[] findAll()
 * @method FinancialItem[] findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FinancialItemRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FinancialItem::class);
    }

    //    /**
    //     * @return FinancialItem[] Returns an array of FinancialItem objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('f.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?FinancialItem
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}

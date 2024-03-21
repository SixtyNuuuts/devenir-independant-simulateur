<?php

namespace App\Repository;

use App\Entity\ProfessionalMonthlySales;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ProfessionalMonthlySales>
 *
 * @method ProfessionalMonthlySales|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProfessionalMonthlySales|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProfessionalMonthlySales[] findAll()
 * @method ProfessionalMonthlySales[] findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProfessionalMonthlySalesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProfessionalMonthlySales::class);
    }

    //    /**
    //     * @return ProfessionalMonthlySales[] Returns an array of ProfessionalMonthlySales objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?ProfessionalMonthlySales
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}

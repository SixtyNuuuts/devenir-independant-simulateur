<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\AnonymousUser;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AnonymousUser>
 *
 * @method AnonymousUser|null find($id, $lockMode = null, $lockVersion = null)
 * @method AnonymousUser|null findOneBy(array $criteria, array $orderBy = null)
 * @method AnonymousUser[]    findAll()
 * @method AnonymousUser[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AnonymousUserRepository extends ServiceEntityRepository
{
	public function __construct(ManagerRegistry $registry)
	{
		parent::__construct($registry, AnonymousUser::class);
	}

	/**
	 * Compte le nombre d'AnonymousUser créés par une IP dans un intervalle de temps donné.
	 */
	public function countByIp(string $ipAddress, \DateTime $since): int
	{
		return $this->createQueryBuilder('a')
			->select('COUNT(a.id)')
			->andWhere('a.ipAddress = :ipAddress')
			->andWhere('a.createdAt >= :since')
			->setParameter('ipAddress', $ipAddress)
			->setParameter('since', $since)
			->getQuery()
			->getSingleScalarResult();
	}

	//    /**
	//     * @return AnonymousUser[] Returns an array of AnonymousUser objects
	//     */
	//    public function findByExampleField($value): array
	//    {
	//        return $this->createQueryBuilder('a')
	//            ->andWhere('a.exampleField = :val')
	//            ->setParameter('val', $value)
	//            ->orderBy('a.id', 'ASC')
	//            ->setMaxResults(10)
	//            ->getQuery()
	//            ->getResult()
	//        ;
	//    }

	//    public function findOneBySomeField($value): ?AnonymousUser
	//    {
	//        return $this->createQueryBuilder('a')
	//            ->andWhere('a.exampleField = :val')
	//            ->setParameter('val', $value)
	//            ->getQuery()
	//            ->getOneOrNullResult()
	//        ;
	//    }
}

<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\AnonymousUser;
use App\Entity\Simulation;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Simulation>
 *
 * @method Simulation|null find($id, $lockMode = null, $lockVersion = null)
 * @method Simulation|null findOneBy(array $criteria, array $orderBy = null)
 * @method Simulation[]    findAll()
 * @method Simulation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SimulationRepository extends ServiceEntityRepository
{
	public function __construct(ManagerRegistry $registry)
	{
		parent::__construct($registry, Simulation::class);
	}

	/**
	 * @param string[]|null $fields
	 *
	 * @return array<mixed>
	 */
	public function findSimulationDataByCriteria(string $activitySlug, ?string $simulationToken = null, User|AnonymousUser|null $user = null, array $fields = ['id', 'token']): array
	{
		$qb = $this->createQueryBuilder('s');

		$selectFields = [];
		foreach ($fields as $field) {
			$selectFields[] = 's.'.$field;
		}
		$qb->select($selectFields);

		$qb->innerJoin('s.activity', 'a')
			->where('a.slug = :activitySlug')
			->setParameter('activitySlug', $activitySlug)
			->orderBy('s.createdAt', 'DESC')
		;

		if ($simulationToken) {
			$qb->andWhere('s.token = :simulationToken')
				->setParameter('simulationToken', $simulationToken)
			;
		} elseif (null !== $user) {
			$userField = $user->getType();

			$qb->andWhere('s.'.$userField.' = :user')
				->setParameter('user', $user)
			;
		}

		$result = $qb->setMaxResults(1)
			->getQuery()
			->getScalarResult()
		;

		if (!$result && !$simulationToken) {
			$result = [$this->findSimulationDataByCriteria($activitySlug, 'default', null, ['id', 'token'])];
		}

		return $result ? $result[0] : [];
	}
}

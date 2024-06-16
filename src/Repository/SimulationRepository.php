<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\AnonymousUser;
use App\Entity\Simulation;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
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

	public function findSimulationByIdAsArray(int $id): mixed
	{
		$qb = $this->createQueryBuilder('s');

		$query = $qb->select([
			's.id',
			's.token',
		])
			->where('s.id = :id')
			->setParameter('id', $id)
			->getQuery();

		try {
			return $query->getOneOrNullResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
		} catch (\Doctrine\ORM\NonUniqueResultException $e) {
			return null;
		}
	}

	/**
	 * @param string[]|null $fields
	 */
	public function findLastSimulationDataByActivity(string $activitySlug, ?string $simulationToken = null, User|AnonymousUser|null $user = null, ?array $fields = null): mixed
	{
		$qb = $this->createQueryBuilder('s');

		$fields ??= ['id', 'token'];
		$selectFields = [];
		foreach ($fields as $field) {
			$selectFields[] = 's.' . $field;
		}
		$qb->select($selectFields);

		$qb->innerJoin('s.activity', 'a')
			->where('a.slug = :activitySlug')
			->setParameter('activitySlug', $activitySlug)
			->orderBy('s.createdAt', 'DESC')
			->setMaxResults(1);;

		if ($simulationToken) {
			$qb->andWhere('s.token = :simulationToken')
				->setParameter('simulationToken', $simulationToken);
		} elseif (null !== $user) {
			$userField = $user->getType();

			$qb->andWhere('s.' . $userField . ' = :user') /* @phpstan-ignore-line */
				->setParameter('user', $user);
		}

		$result = $qb->getQuery()->getScalarResult();

		if (!$result && !$simulationToken) {
			$result = $this->findLastSimulationDataByActivity($activitySlug, 'default', null, ['id', 'token']);
		}

		if (\is_array($result) && \count($result) === 1) {
			return $result[0];
		}

		return $result;
	}

	/**
	 * @param string[]|null $fields
	 */
	public function findSimulationsDataByActivity(string $activitySlug, User|AnonymousUser|null $user = null, ?array $fields = null): mixed
	{
		$qb = $this->createQueryBuilder('s');

		$fields ??= ['id', 'token'];
		$selectFields = [];
		foreach ($fields as $field) {
			$selectFields[] = 's.' . $field;
		}
		$qb->select($selectFields);

		$qb->innerJoin('s.activity', 'a')
			->where('a.slug = :activitySlug')
			->setParameter('activitySlug', $activitySlug)
			->orderBy('s.createdAt', 'DESC');

		if (null !== $user) {
			$userField = $user->getType();

			$qb->andWhere('s.' . $userField . ' = :user') /* @phpstan-ignore-line */
				->setParameter('user', $user);
		}

		$result = $qb->getQuery()->getScalarResult();

		return $result;
	}

	/**
	 * @param string[]|null $fields
	 */
	public function findAllSimulationsModels(): mixed
	{
		$qb = $this->createQueryBuilder('s');

		$fields ??= ['id', 'token', 'activity.goal', 'activity.slug'];
		$selectFields = [];
		foreach ($fields as $field) {
			if (strpos($field, 'activity.') === 0) {
				$selectFields[] = str_replace('activity.', 'a.', $field) . ' AS ' . str_replace('.', '_', $field);
			} else {
				$selectFields[] = 's.' . $field;
			}
		}
		$qb->select($selectFields)
			->leftJoin('s.activity', 'a');

		$qb->andWhere('s.token = :simulationToken')
			->setParameter('simulationToken', 'default')
			->orderBy('s.createdAt', 'DESC');

		$result = $qb->getQuery()->getScalarResult();

		return $result;
	}

	/**
	 * @return array{
	 *   data: list<array{
	 *     id: mixed,
	 *     token: mixed,
	 *     activityName: mixed,
	 *     userType: mixed
	 *   }>,
	 *   total: int,
	 *   pages: int,
	 *   page: int,
	 *   pageSize: int
	 * }
	 */
	public function findSimulationsDataByCriteriaWithPagination(?string $activitySlug = null, User|AnonymousUser|string|null $user = null, int $page = 1, int $pageSize = 10): array
	{
		$qb = $this->createQueryBuilder('s')
			->select('s.id', 's.token', 'a.name as activityName')
			->leftJoin('s.activity', 'a')
			->where('s.token != :defaultToken')
			->setParameter('defaultToken', 'default')
			->orderBy('s.createdAt', 'DESC');

		if ($activitySlug) {
			$qb->andWhere('a.slug = :activitySlug')
				->setParameter('activitySlug', $activitySlug);
		}

		if ($user) {
			$userField = \is_object($user) && is_a($user, User::class) ? 'user' : 'anonymousUser';
			$qb->addSelect("'" . $userField . "' as userType")
				->andWhere('s.' . $userField . ' = :user')
				->setParameter('user', $user);
		}

		$paginator = new Paginator($qb);
		$paginator
			->setUseOutputWalkers(false)
			->getQuery()
			->setFirstResult($pageSize * ($page - 1))
			->setMaxResults($pageSize);

		$totalItems = \count($paginator);
		$pagesCount = (int) ceil($totalItems / $pageSize);
		$results = [];

		foreach ($paginator as $item) {
			if (\is_array($item)) {
				$results[] = [
					'id' => $item['id'],
					'token' => $item['token'],
					'activityName' => $item['activityName'],
					'userType' => $item['userType'] ?? null,
				];
			}
		}

		return [
			'data' => $results,
			'total' => $totalItems,
			'pages' => $pagesCount,
			'page' => $page,
			'pageSize' => $pageSize,
		];
	}
}

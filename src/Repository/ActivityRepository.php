<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Activity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Activity>
 *
 * @method Activity|null find($id, $lockMode = null, $lockVersion = null)
 * @method Activity|null findOneBy(array $criteria, array $orderBy = null)
 * @method Activity[]    findAll()
 * @method Activity[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ActivityRepository extends ServiceEntityRepository
{
	public function __construct(ManagerRegistry $registry)
	{
		parent::__construct($registry, Activity::class);
	}

	public function findActivityByIdAsArray(int $id): mixed
	{
		$qb = $this->createQueryBuilder('a');

		$query = $qb->select([
			'a.id',
			'a.name',
			'a.slug',
			'a.goal',
			'a.title',
			'a.objectives',
			'a.description',
			'a.detailedDescription',
			'a.mobileImage',
			'a.desktopImage',
		])
			->where('a.id = :id')
			->setParameter('id', $id)
			->getQuery();

		try {
			return $query->getOneOrNullResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
		} catch (\Doctrine\ORM\NonUniqueResultException $e) {
			return null;
		}
	}

	/**
	 * @return mixed[]
	 */
	public function findAllActivitiesAsArray(): array
	{
		$qb = $this->createQueryBuilder('a');

		$query = $qb->select([
			'a.id',
			'a.name',
			'a.slug',
			'a.goal',
			'a.title',
			'a.objectives',
			'a.description',
			'a.detailedDescription',
			'a.mobileImage',
			'a.desktopImage',
		])
			->getQuery();

		return $query->getArrayResult();
	}

	/**
	 * @param string[]|null $fields
	 */
	public function findActivityDataBySlug(string $slug, ?array $fields = null): mixed
	{
		$qb = $this->createQueryBuilder('a');

		if (null === $fields) {
			$fields = ['id', 'name', 'slug', 'goal', 'title', 'objectives', 'description', 'detailedDescription', 'mobileImage', 'desktopImage'];
		}

		$selectFields = [];
		foreach ($fields as $field) {
			$selectFields[] = 'a.' . $field;
		}
		$qb->select($selectFields);

		$qb->where('a.slug = :slug')
			->setParameter('slug', $slug);

		$result = $qb->getQuery()->getOneOrNullResult();

		return $result ? $result : [];
	}
}

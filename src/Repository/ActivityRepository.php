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

	/**
	 * @param string[]|null $fields
	 */
	public function findActivityDataBySlug(string $slug, ?array $fields = null): mixed
	{
		$qb = $this->createQueryBuilder('a');

		if (null === $fields) {
			$fields = ['id', 'name', 'slug', 'summary', 'description', 'bannerImage'];
		}

		$selectFields = [];
		foreach ($fields as $field) {
			$selectFields[] = 'a.'.$field;
		}
		$qb->select($selectFields);

		$qb->where('a.slug = :slug')
			->setParameter('slug', $slug)
		;

		$result = $qb->getQuery()->getOneOrNullResult();

		return $result ? $result : [];
	}
}

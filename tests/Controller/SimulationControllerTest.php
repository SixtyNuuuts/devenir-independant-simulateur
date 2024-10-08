<?php

declare(strict_types=1);

namespace App\Test\Controller;

use App\Entity\Simulation;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * @internal
 *
 * @coversNothing
 */
final class SimulationControllerTest extends WebTestCase
{
	private KernelBrowser $client;
	private EntityManagerInterface $manager;
	private EntityRepository $repository;
	private string $path = '/simulation/';

	protected function setUp(): void
	{
		$this->client = self::createClient();
		$this->manager = self::getContainer()->get('doctrine')->getManager(); /* @phpstan-ignore-line */
		$this->repository = $this->manager->getRepository(Simulation::class);

		foreach ($this->repository->findAll() as $object) {
			$this->manager->remove($object);
		}

		$this->manager->flush();
	}

	public function testIndex(): void
	{
		$crawler = $this->client->request('GET', $this->path);

		self::assertResponseStatusCodeSame(200);
		self::assertPageTitleContains('Simulation index');

		// Use the $crawler to perform additional assertions e.g.
		// self::assertSame('Some text on the page', $crawler->filter('.p')->first());
	}

	public function testNew(): void
	{
		self::markTestIncomplete();
		$this->client->request('GET', sprintf('%snew', $this->path)); /* @phpstan-ignore-line */

		self::assertResponseStatusCodeSame(200);

		$this->client->submitForm('Save', [
			'simulation[token]' => 'Testing',
			'simulation[activity]' => 'Testing',
		]);

		self::assertResponseRedirects($this->path);

		self::assertSame(1, $this->repository->count([]));
	}

	public function testShow(): void
	{
		self::markTestIncomplete();
		$fixture = new Simulation(); /* @phpstan-ignore-line */
		$fixture->setToken('My Title');
		$fixture->setActivity('My Title');

		$this->manager->persist($fixture);
		$this->manager->flush();

		$this->client->request('GET', sprintf('%s%s', $this->path, $fixture->getId()));

		self::assertResponseStatusCodeSame(200);
		self::assertPageTitleContains('Simulation');

		// Use assertions to check that the properties are properly displayed.
	}

	public function testEdit(): void
	{
		self::markTestIncomplete();
		$fixture = new Simulation(); /* @phpstan-ignore-line */
		$fixture->setToken('Value');
		$fixture->setActivity('Value');

		$this->manager->persist($fixture);
		$this->manager->flush();

		$this->client->request('GET', sprintf('%s%s/edit', $this->path, $fixture->getId()));

		$this->client->submitForm('Update', [
			'simulation[token]' => 'Something New',
			'simulation[activity]' => 'Something New',
		]);

		self::assertResponseRedirects('/simulation/');

		$fixture = $this->repository->findAll();

		self::assertSame('Something New', $fixture[0]->getToken());
		self::assertSame('Something New', $fixture[0]->getActivity());
	}

	public function testRemove(): void
	{
		self::markTestIncomplete();
		$fixture = new Simulation(); /* @phpstan-ignore-line */
		$fixture->setToken('Value');
		$fixture->setActivity('Value');

		$this->manager->persist($fixture);
		$this->manager->flush();

		$this->client->request('GET', sprintf('%s%s', $this->path, $fixture->getId()));
		$this->client->submitForm('Delete');

		self::assertResponseRedirects('/simulation/');
		self::assertSame(0, $this->repository->count([]));
	}
}

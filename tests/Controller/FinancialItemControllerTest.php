<?php

declare(strict_types=1);

namespace App\Test\Controller;

use App\Entity\FinancialItem;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * @internal
 *
 * @coversNothing
 */
final class FinancialItemControllerTest extends WebTestCase
{
	private KernelBrowser $client;
	private EntityManagerInterface $manager;
	private EntityRepository $repository;
	private string $path = '/financial/item/';

	protected function setUp(): void
	{
		$this->client = self::createClient();
		$this->manager = self::getContainer()->get('doctrine')->getManager(); /* @phpstan-ignore-line */
		$this->repository = $this->manager->getRepository(FinancialItem::class);

		foreach ($this->repository->findAll() as $object) {
			$this->manager->remove($object);
		}

		$this->manager->flush();
	}

	public function testIndex(): void
	{
		$crawler = $this->client->request('GET', $this->path);

		self::assertResponseStatusCodeSame(200);
		self::assertPageTitleContains('FinancialItem index');

		// Use the $crawler to perform additional assertions e.g.
		// self::assertSame('Some text on the page', $crawler->filter('.p')->first());
	}

	public function testNew(): void
	{
		self::markTestIncomplete();
		$this->client->request('GET', sprintf('%snew', $this->path)); /* @phpstan-ignore-line */

		self::assertResponseStatusCodeSame(200);

		$this->client->submitForm('Save', [
			'financial_item[name]' => 'Testing',
			'financial_item[value]' => 'Testing',
			'financial_item[nature]' => 'Testing',
			'financial_item[type]' => 'Testing',
			'financial_item[attributes]' => 'Testing',
			'financial_item[simulation]' => 'Testing',
		]);

		self::assertResponseRedirects($this->path);

		self::assertSame(1, $this->repository->count([]));
	}

	public function testShow(): void
	{
		self::markTestIncomplete();
		$fixture = new FinancialItem(); /* @phpstan-ignore-line */
		$fixture->setName('My Title');
		$fixture->setValue('My Title');
		$fixture->setNature('My Title');
		$fixture->setType('My Title');
		$fixture->setAttributes('My Title');
		$fixture->setSimulation('My Title');

		$this->manager->persist($fixture);
		$this->manager->flush();

		$this->client->request('GET', sprintf('%s%s', $this->path, $fixture->getId()));

		self::assertResponseStatusCodeSame(200);
		self::assertPageTitleContains('FinancialItem');

		// Use assertions to check that the properties are properly displayed.
	}

	public function testEdit(): void
	{
		self::markTestIncomplete();
		$fixture = new FinancialItem(); /* @phpstan-ignore-line */
		$fixture->setName('Value');
		$fixture->setValue('Value');
		$fixture->setNature('Value');
		$fixture->setType('Value');
		$fixture->setAttributes('Value');
		$fixture->setSimulation('Value');

		$this->manager->persist($fixture);
		$this->manager->flush();

		$this->client->request('GET', sprintf('%s%s/edit', $this->path, $fixture->getId()));

		$this->client->submitForm('Update', [
			'financial_item[name]' => 'Something New',
			'financial_item[value]' => 'Something New',
			'financial_item[nature]' => 'Something New',
			'financial_item[type]' => 'Something New',
			'financial_item[attributes]' => 'Something New',
			'financial_item[simulation]' => 'Something New',
		]);

		self::assertResponseRedirects('/financial/item/');

		$fixture = $this->repository->findAll();

		self::assertSame('Something New', $fixture[0]->getName());
		self::assertSame('Something New', $fixture[0]->getValue());
		self::assertSame('Something New', $fixture[0]->getNature());
		self::assertSame('Something New', $fixture[0]->getType());
		self::assertSame('Something New', $fixture[0]->getAttributes());
		self::assertSame('Something New', $fixture[0]->getSimulation());
	}

	public function testRemove(): void
	{
		self::markTestIncomplete();
		$fixture = new FinancialItem(); /* @phpstan-ignore-line */
		$fixture->setName('Value');
		$fixture->setValue('Value');
		$fixture->setNature('Value');
		$fixture->setType('Value');
		$fixture->setAttributes('Value');
		$fixture->setSimulation('Value');

		$this->manager->persist($fixture);
		$this->manager->flush();

		$this->client->request('GET', sprintf('%s%s', $this->path, $fixture->getId()));
		$this->client->submitForm('Delete');

		self::assertResponseRedirects('/financial/item/');
		self::assertSame(0, $this->repository->count([]));
	}
}

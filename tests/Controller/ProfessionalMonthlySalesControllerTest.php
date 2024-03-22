<?php

namespace App\Test\Controller;

use App\Entity\ProfessionalMonthlySales;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ProfessionalMonthlySalesControllerTest extends WebTestCase
{
    private KernelBrowser $client;
    private EntityManagerInterface $manager;
    private EntityRepository $repository;
    private string $path = '/professional/monthly/sales/';

    protected function setUp(): void
    {
        $this->client     = static::createClient();
        $this->manager    = static::getContainer()->get('doctrine')->getManager(); /* @phpstan-ignore-line */
        $this->repository = $this->manager->getRepository(ProfessionalMonthlySales::class);

        foreach ($this->repository->findAll() as $object) {
            $this->manager->remove($object);
        }

        $this->manager->flush();
    }

    public function testIndex(): void
    {
        $crawler = $this->client->request('GET', $this->path);

        self::assertResponseStatusCodeSame(200);
        self::assertPageTitleContains('ProfessionalMonthlySales index');

        // Use the $crawler to perform additional assertions e.g.
        // self::assertSame('Some text on the page', $crawler->filter('.p')->first());
    }

    public function testNew(): void
    {
        $this->markTestIncomplete();
        $this->client->request('GET', sprintf('%snew', $this->path)); /* @phpstan-ignore-line */

        self::assertResponseStatusCodeSame(200);

        $this->client->submitForm('Save', [
            'professional_monthly_sale[quantity]'      => 'Testing',
            'professional_monthly_sale[month]'         => 'Testing',
            'professional_monthly_sale[financialItem]' => 'Testing',
        ]);

        self::assertResponseRedirects($this->path);

        self::assertSame(1, $this->repository->count([]));
    }

    public function testShow(): void
    {
        $this->markTestIncomplete();
        $fixture = new ProfessionalMonthlySales(); /* @phpstan-ignore-line */
        $fixture->setQuantity('My Title');
        $fixture->setMonth('My Title');
        $fixture->setFinancialItem('My Title');

        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->client->request('GET', sprintf('%s%s', $this->path, $fixture->getId()));

        self::assertResponseStatusCodeSame(200);
        self::assertPageTitleContains('ProfessionalMonthlySale');

        // Use assertions to check that the properties are properly displayed.
    }

    public function testEdit(): void
    {
        $this->markTestIncomplete();
        $fixture = new ProfessionalMonthlySales(); /* @phpstan-ignore-line */
        $fixture->setQuantity('Value');
        $fixture->setMonth('Value');
        $fixture->setFinancialItem('Value');

        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->client->request('GET', sprintf('%s%s/edit', $this->path, $fixture->getId()));

        $this->client->submitForm('Update', [
            'professional_monthly_sale[quantity]'      => 'Something New',
            'professional_monthly_sale[month]'         => 'Something New',
            'professional_monthly_sale[financialItem]' => 'Something New',
        ]);

        self::assertResponseRedirects('/professional/monthly/sales/');

        $fixture = $this->repository->findAll();

        self::assertSame('Something New', $fixture[0]->getQuantity());
        self::assertSame('Something New', $fixture[0]->getMonth());
        self::assertSame('Something New', $fixture[0]->getFinancialItem());
    }

    public function testRemove(): void
    {
        $this->markTestIncomplete();
        $fixture = new ProfessionalMonthlySales(); /* @phpstan-ignore-line */
        $fixture->setQuantity('Value');
        $fixture->setMonth('Value');
        $fixture->setFinancialItem('Value');

        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->client->request('GET', sprintf('%s%s', $this->path, $fixture->getId()));
        $this->client->submitForm('Delete');

        self::assertResponseRedirects('/professional/monthly/sales/');
        self::assertSame(0, $this->repository->count([]));
    }
}

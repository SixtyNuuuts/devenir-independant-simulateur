<?php

namespace App\Entity;

use App\Repository\ProfessionalMonthlySalesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProfessionalMonthlySalesRepository::class)]
class ProfessionalMonthlySales
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'bigint')]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'professionalMonthlySales')]
    #[ORM\JoinColumn(nullable: false)]
    private ?FinancialItem $financialItem = null;

    #[ORM\Column]
    private ?int $quantity = null;

    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $month = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFinancialItem(): ?FinancialItem
    {
        return $this->financialItem;
    }

    public function setFinancialItem(?FinancialItem $financialItem): static
    {
        $this->financialItem = $financialItem;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getMonth(): ?int
    {
        return $this->month;
    }

    public function setMonth(int $month): static
    {
        $this->month = $month;

        return $this;
    }
}

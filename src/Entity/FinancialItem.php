<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Enum\FinancialItemType;
use App\Enum\FinancialItemNature;
use App\Repository\FinancialItemRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: FinancialItemRepository::class)]
class FinancialItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'bigint')]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $value = null;

    #[ORM\Column(type: 'string', enumType: FinancialItemNature::class, length: 12)]
    private ?string $nature = null;

    #[ORM\Column(type: 'string', enumType: FinancialItemType::class, length: 8)]
    private ?string $type = null;

    /**
     * @var array<mixed>|null
     */
    #[ORM\Column(nullable: true)]
    private ?array $attributes = null;

    #[ORM\OneToMany(targetEntity: ProfessionalMonthlySales::class, mappedBy: 'financialItem', orphanRemoval: true)]
    private Collection $professionalMonthlySales;

    public function __construct()
    {
        $this->professionalMonthlySales = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(string $value): static
    {
        $this->value = $value;

        return $this;
    }

    public function getNature(): ?string
    {
        return $this->nature;
    }

    public function setNature(string $nature): static
    {
        $this->nature = $nature;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return array<mixed>|null
     */
    public function getAttributes(): ?array
    {
        return $this->attributes;
    }

    /**
     * @param array<mixed>|null $attributes
     */
    public function setAttributes(?array $attributes): static
    {
        $this->attributes = $attributes;

        return $this;
    }

    /**
     * @return Collection<int, ProfessionalMonthlySales>
     */
    public function getProfessionalMonthlySales(): Collection
    {
        return $this->professionalMonthlySales;
    }

    public function addProfessionalMonthlySale(ProfessionalMonthlySales $professionalMonthlySale): static
    {
        if (!$this->professionalMonthlySales->contains($professionalMonthlySale)) {
            $this->professionalMonthlySales->add($professionalMonthlySale);
            $professionalMonthlySale->setFinancialItem($this);
        }

        return $this;
    }

    public function removeProfessionalMonthlySale(ProfessionalMonthlySales $professionalMonthlySale): static
    {
        if ($this->professionalMonthlySales->removeElement($professionalMonthlySale)) {
            // set the owning side to null (unless already changed)
            if ($professionalMonthlySale->getFinancialItem() === $this) {
                $professionalMonthlySale->setFinancialItem(null);
            }
        }

        return $this;
    }
}

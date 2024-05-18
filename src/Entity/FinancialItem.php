<?php

declare(strict_types=1);

namespace App\Entity;

use App\Enum\FinancialItemNature;
use App\Enum\FinancialItemType;
use App\Repository\FinancialItemRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FinancialItemRepository::class)]
class FinancialItem
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column(type: 'bigint')]
	private ?string $id = null;

	#[ORM\Column]
	private ?\DateTimeImmutable $createdAt = null;

	#[ORM\Column]
	private ?\DateTime $updatedAt = null;

	#[ORM\Column(length: 255)]
	private ?string $name = null;

	#[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
	private ?string $value = null;

	#[ORM\Column(type: 'string', enumType: FinancialItemNature::class, length: 12)]
	private ?FinancialItemNature $nature = null;

	#[ORM\Column(type: 'string', enumType: FinancialItemType::class, length: 8)]
	private ?FinancialItemType $type = null;

	/**
	 * @var array<mixed>|null
	 */
	#[ORM\Column(type: Types::JSON, nullable: true)]
	private ?array $attributes = [];

	#[ORM\ManyToOne(inversedBy: 'financialItems')]
	#[ORM\JoinColumn(nullable: false)]
	private ?Simulation $simulation = null;

	public function __construct()
	{
		$this->createdAt = new \DateTimeImmutable();
		$this->updatedAt = new \DateTime();
	}

	#[ORM\PreUpdate]
	public function onPreUpdate(): void
	{
		$this->updatedAt = new \DateTime();
	}

	public function __toString(): string
	{
		return $this->name ?? '---';
	}

	public function __clone()
	{
		$this->id = null;
	}

	public function getId(): ?string
	{
		return $this->id;
	}

	public function getCreatedAt(): ?\DateTimeImmutable
	{
		return $this->createdAt;
	}

	public function setCreatedAt(\DateTimeImmutable $createdAt): static
	{
		$this->createdAt = $createdAt;

		return $this;
	}

	public function getUpdatedAt(): ?\DateTime
	{
		return $this->updatedAt;
	}

	public function setUpdatedAt(\DateTime $updatedAt): static
	{
		$this->updatedAt = $updatedAt;

		return $this;
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

	public function getNature(): FinancialItemNature
	{
		return $this->nature;
	}

	public function setNature(FinancialItemNature $nature): static
	{
		$this->nature = $nature;

		return $this;
	}

	public function getType(): FinancialItemType
	{
		return $this->type;
	}

	public function setType(FinancialItemType $type): static
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

	public function getSimulation(): ?Simulation
	{
		return $this->simulation;
	}

	public function setSimulation(?Simulation $simulation): static
	{
		$this->simulation = $simulation;

		return $this;
	}
}

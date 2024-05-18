<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\ActivityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ActivityRepository::class)]
class Activity
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	private ?int $id = null;

	#[ORM\Column]
	private ?\DateTimeImmutable $createdAt = null;

	#[ORM\Column]
	private ?\DateTime $updatedAt = null;

	#[ORM\Column(length: 255)]
	private ?string $name = null;

	#[ORM\Column(length: 255)]
	private ?string $slug = null;

	#[ORM\Column(length: 255)]
	private ?string $title = null;

	#[ORM\Column(type: Types::JSON)]
	private array $objectives = [];

	#[ORM\Column(type: Types::TEXT, nullable: false)]
	private ?string $description = null;

	#[ORM\Column(type: Types::TEXT)]
	private ?string $detailed_description = null;

	#[ORM\Column(length: 255)]
	private ?string $mobileImage = null;

	#[ORM\Column(length: 255)]
	private ?string $desktopImage = null;

	#[ORM\OneToMany(targetEntity: Simulation::class, mappedBy: 'activity', orphanRemoval: true)]
	private Collection $simulations;

	public function __construct()
	{
		$this->createdAt = new \DateTimeImmutable();
		$this->updatedAt = new \DateTime();
		$this->simulations = new ArrayCollection();
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

	public function getId(): ?int
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

	public function getSlug(): ?string
	{
		return $this->slug;
	}

	public function setSlug(string $slug): static
	{
		$this->slug = $slug;

		return $this;
	}

	public function getTitle(): ?string
	{
		return $this->title;
	}

	public function setTitle(string $title): static
	{
		$this->title = $title;

		return $this;
	}

	public function getObjectives(): array
	{
		return $this->objectives;
	}

	public function setObjectives(array $objectives): static
	{
		$this->objectives = $objectives;

		return $this;
	}

	public function getDescription(): ?string
	{
		return $this->description;
	}

	public function setDescription(string $description): static
	{
		$this->description = $description;

		return $this;
	}

	public function getDetailedDescription(): ?string
	{
		return $this->detailed_description;
	}

	public function setDetailedDescription(string $detailed_description): static
	{
		$this->detailed_description = $detailed_description;

		return $this;
	}

	public function getMobileImage(): ?string
	{
		return $this->mobileImage;
	}

	public function setMobileImage(?string $mobileImage): self
	{
		$this->mobileImage = $mobileImage;
		return $this;
	}

	public function getDesktopImage(): ?string
	{
		return $this->desktopImage;
	}

	public function setDesktopImage(?string $desktopImage): self
	{
		$this->desktopImage = $desktopImage;
		return $this;
	}

	/**
	 * @return Collection<int, Simulation>
	 */
	public function getSimulations(): Collection
	{
		return $this->simulations;
	}

	public function addSimulation(Simulation $simulation): static
	{
		if (!$this->simulations->contains($simulation)) {
			$this->simulations->add($simulation);
			$simulation->setActivity($this);
		}

		return $this;
	}

	public function removeSimulation(Simulation $simulation): static
	{
		if ($this->simulations->removeElement($simulation)) {
			// set the owning side to null (unless already changed)
			if ($simulation->getActivity() === $this) {
				$simulation->setActivity(null);
			}
		}

		return $this;
	}
}

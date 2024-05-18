<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\SimulationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SimulationRepository::class)]
class Simulation
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	private ?int $id = null;

	#[ORM\Column(length: 255)]
	private ?string $token = null;

	#[ORM\Column]
	private ?\DateTimeImmutable $createdAt = null;

	#[ORM\Column]
	private ?\DateTime $updatedAt = null;

	#[ORM\ManyToOne(inversedBy: 'simulations')]
	#[ORM\JoinColumn(nullable: false)]
	private ?Activity $activity = null;

	#[ORM\OneToMany(targetEntity: FinancialItem::class, mappedBy: 'simulation', orphanRemoval: true)]
	private Collection $financialItems;

	#[ORM\ManyToOne(inversedBy: 'simulations')]
	private ?User $user = null;

	#[ORM\ManyToOne(inversedBy: 'simulations')]
	private ?AnonymousUser $anonymousUser = null;

	public function __construct()
	{
		$this->financialItems = new ArrayCollection();
		$this->createdAt = new \DateTimeImmutable();
		$this->updatedAt = new \DateTime();
		$this->token = $this->generateShortUniqueId();
	}

	#[ORM\PreUpdate]
	public function onPreUpdate(): void
	{
		$this->updatedAt = new \DateTime();
	}

	public function __toString(): string
	{
		return $this->token ?? '---';
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

	public function getToken(): ?string
	{
		return $this->token;
	}

	public function setToken(string $token): static
	{
		$this->token = $token;

		return $this;
	}

	public function getActivity(): ?Activity
	{
		return $this->activity;
	}

	public function setActivity(?Activity $activity): static
	{
		$this->activity = $activity;

		return $this;
	}

	/**
	 * @return Collection<int, FinancialItem>
	 */
	public function getFinancialItems(): Collection
	{
		return $this->financialItems;
	}

	public function addFinancialItem(FinancialItem $financialItem): static
	{
		if (!$this->financialItems->contains($financialItem)) {
			$this->financialItems->add($financialItem);
			$financialItem->setSimulation($this);
		}

		return $this;
	}

	public function removeFinancialItem(FinancialItem $financialItem): static
	{
		if ($this->financialItems->removeElement($financialItem)) {
			// set the owning side to null (unless already changed)
			if ($financialItem->getSimulation() === $this) {
				$financialItem->setSimulation(null);
			}
		}

		return $this;
	}

	public function getUser(): ?User
	{
		return $this->user;
	}

	public function setUser(?User $user): static
	{
		$this->user = $user;

		return $this;
	}

	public function getAnonymousUser(): ?AnonymousUser
	{
		return $this->anonymousUser;
	}

	public function setAnonymousUser(?AnonymousUser $anonymousUser): static
	{
		$this->anonymousUser = $anonymousUser;

		return $this;
	}

	private function generateShortUniqueId(int $length = 8): string
	{
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = \strlen($characters);
		$uniqueId = '';
		for ($i = 0; $i < $length; ++$i) {
			$uniqueId .= $characters[random_int(0, $charactersLength - 1)];
		}

		return $uniqueId;
	}
}

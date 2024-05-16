<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\AnonymousUserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AnonymousUserRepository::class)]
class AnonymousUser
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column(type: 'bigint')]
	private ?string $id = null;

	#[ORM\Column]
	private ?\DateTimeImmutable $createdAt = null;

	#[ORM\Column(length: 255, nullable: true)]
	private ?string $sessionId = null;

	#[ORM\OneToMany(targetEntity: Simulation::class, mappedBy: 'anonymousUser')]
	private Collection $simulations;

	public function __construct()
	{
		$this->createdAt = new \DateTimeImmutable();
		$this->simulations = new ArrayCollection();
	}

	public function __toString(): string
	{
		return $this->id ?? '---';
	}

	public function getType(): string
	{
		return 'anonymousUser';
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

	public function getSessionId(): ?string
	{
		return $this->sessionId;
	}

	public function setSessionId(?string $sessionId): static
	{
		$this->sessionId = $sessionId;

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
			$simulation->setAnonymousUser($this);
		}

		return $this;
	}

	public function removeSimulation(Simulation $simulation): static
	{
		if ($this->simulations->removeElement($simulation)) {
			// set the owning side to null (unless already changed)
			if ($simulation->getAnonymousUser() === $this) {
				$simulation->setAnonymousUser(null);
			}
		}

		return $this;
	}
}

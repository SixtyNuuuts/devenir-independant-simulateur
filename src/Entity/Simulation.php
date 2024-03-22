<?php

namespace App\Entity;

use App\Repository\SimulationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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

    #[ORM\ManyToOne(inversedBy: 'simulations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Activity $activity = null;

    #[ORM\OneToMany(targetEntity: FinancialItem::class, mappedBy: 'simulation', orphanRemoval: true)]
    private Collection $financialItems;

    public function __construct()
    {
        $this->financialItems = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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
}

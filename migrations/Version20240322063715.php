<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240322063715 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE activity (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE financial_item (id BIGINT AUTO_INCREMENT NOT NULL, simulation_id INT NOT NULL, name VARCHAR(255) NOT NULL, value NUMERIC(10, 2) NOT NULL, nature VARCHAR(12) NOT NULL, type VARCHAR(8) NOT NULL, attributes JSON DEFAULT NULL, INDEX IDX_CF74835AFEC09103 (simulation_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE professional_monthly_sales (id BIGINT AUTO_INCREMENT NOT NULL, financial_item_id BIGINT NOT NULL, quantity INT NOT NULL, month SMALLINT NOT NULL, INDEX IDX_B673827F40AC1034 (financial_item_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE simulation (id INT AUTO_INCREMENT NOT NULL, activity_id INT NOT NULL, token VARCHAR(255) NOT NULL, INDEX IDX_CBDA467B81C06096 (activity_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE financial_item ADD CONSTRAINT FK_CF74835AFEC09103 FOREIGN KEY (simulation_id) REFERENCES simulation (id)');
        $this->addSql('ALTER TABLE professional_monthly_sales ADD CONSTRAINT FK_B673827F40AC1034 FOREIGN KEY (financial_item_id) REFERENCES financial_item (id)');
        $this->addSql('ALTER TABLE simulation ADD CONSTRAINT FK_CBDA467B81C06096 FOREIGN KEY (activity_id) REFERENCES activity (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE financial_item DROP FOREIGN KEY FK_CF74835AFEC09103');
        $this->addSql('ALTER TABLE professional_monthly_sales DROP FOREIGN KEY FK_B673827F40AC1034');
        $this->addSql('ALTER TABLE simulation DROP FOREIGN KEY FK_CBDA467B81C06096');
        $this->addSql('DROP TABLE activity');
        $this->addSql('DROP TABLE financial_item');
        $this->addSql('DROP TABLE professional_monthly_sales');
        $this->addSql('DROP TABLE simulation');
        $this->addSql('DROP TABLE messenger_messages');
    }
}

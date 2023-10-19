﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PostIt.Posts.Service.Infrastructure.Persistence;

#nullable disable

namespace PostIt.Posts.Service.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("PostIt.Posts.Service.Domain.Comments.Comment", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedOnUtc")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("ModifiedOnUtc")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("PostId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("PostId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("PostIt.Posts.Service.Domain.Likes.Like", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedOnUtc")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("ModifiedOnUtc")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("PostId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("PostId");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("PostIt.Posts.Service.Domain.Posts.Post", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Body")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedOnUtc")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("ModifiedOnUtc")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("PostIt.Posts.Service.Domain.Comments.Comment", b =>
                {
                    b.HasOne("PostIt.Posts.Service.Domain.Posts.Post", "Post")
                        .WithMany("Comments")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");
                });

            modelBuilder.Entity("PostIt.Posts.Service.Domain.Likes.Like", b =>
                {
                    b.HasOne("PostIt.Posts.Service.Domain.Posts.Post", "Post")
                        .WithMany("Likes")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");
                });

            modelBuilder.Entity("PostIt.Posts.Service.Domain.Posts.Post", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("Likes");
                });
#pragma warning restore 612, 618
        }
    }
}

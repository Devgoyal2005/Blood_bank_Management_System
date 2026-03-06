from database import Base, engine

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("All tables dropped successfully!")

print("\nCreating new tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")

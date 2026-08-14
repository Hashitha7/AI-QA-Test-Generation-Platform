from database import SessionLocal
from models import Defect

def seed_db():
    db = SessionLocal()
    
    if db.query(Defect).count() > 0:
        print("Database already seeded.")
        return
        
    defects = [
        Defect(
            id="DEF-018",
            title="Checkout total calculation incorrect when applying multiple discount codes",
            severity="Critical",
            status="Open",
            module="Checkout Flow",
            ai_summary="AI detected a logical error in the discount stacking mechanism. When two or more discount codes are applied, the second discount is being applied to the original price instead of the discounted price.",
            root_cause="The `applyDiscount()` function in `CartService.ts` resets the `currentPrice` variable to the original `basePrice` on each iteration, preventing cumulative discounting.",
            suggested_fix="Modify `applyDiscount()` to pass the result of the previous discount as the base for the next one."
        ),
        Defect(
            id="DEF-017",
            title="User session expires immediately after enabling 'Remember Me'",
            severity="High",
            status="In Progress",
            module="Authentication",
            ai_summary="The 'Remember Me' flag is being saved, but the JWT token expiry duration is not being updated accordingly.",
            root_cause="In `AuthController.py`, the `generate_token()` call ignores the `remember_me` boolean flag.",
            suggested_fix="Pass `expiry=2592000` (30 days) to `generate_token()` when `remember_me` is `True`."
        )
    ]
    
    for d in defects:
        db.add(d)
        
    db.commit()
    print("Database seeded with mock defects.")

if __name__ == "__main__":
    seed_db()

# models.py
from datetime import datetime
from extensions import db

class MenuItem(db.Model):
    __tablename__ = "menu_items"

    id = db.Column(db.Integer, primary_key=True)
    restaurant = db.Column(db.String(120), nullable=False, index=True)
    item       = db.Column(db.String(200), nullable=False, index=True)
    category   = db.Column(db.String(80),  nullable=True, index=True)

    # Macros (per serving)
    calories = db.Column(db.Integer)
    protein  = db.Column(db.Float)
    carbs    = db.Column(db.Float)
    fat      = db.Column(db.Float)
    sodium   = db.Column(db.Float)

    # Extras / UX
    serving_size_text  = db.Column(db.String(120))
    is_main_candidate  = db.Column(db.Boolean, default=False, index=True)

    # Bookkeeping
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,
                           onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<MenuItem {self.item!r} @ {self.restaurant!r}>"

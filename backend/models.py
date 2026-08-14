from sqlalchemy import Column, String, Text
from database import Base
import uuid
import json

def generate_uuid():
    return str(uuid.uuid4())

class TestCase(Base):
    __tablename__ = "test_cases"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)  # Happy Path, Edge Case, Negative
    priority = Column(String, nullable=False) # High, Medium, Low
    steps = Column(Text, nullable=False) # Stored as JSON string
    expected_result = Column(Text, nullable=False)

    @property
    def steps_list(self):
        return json.loads(self.steps)

    @steps_list.setter
    def steps_list(self, value):
        self.steps = json.dumps(value)

class Defect(Base):
    __tablename__ = "defects"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    status = Column(String, nullable=False)
    module = Column(String, nullable=False)
    ai_summary = Column(Text, nullable=True)
    root_cause = Column(Text, nullable=True)
    suggested_fix = Column(Text, nullable=True)

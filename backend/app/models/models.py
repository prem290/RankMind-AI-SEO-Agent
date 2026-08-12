import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.models.database import Base

class Website(Base):
    __tablename__ = "websites"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    domain = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    keywords = relationship("Keyword", back_populates="website")
    experiments = relationship("Experiment", back_populates="website")

class Keyword(Base):
    __tablename__ = "keywords"

    id = Column(String, primary_key=True, index=True)
    website_id = Column(String, ForeignKey("websites.id"))
    keyword = Column(String, index=True)
    position = Column(Integer)
    previous_position = Column(Integer)
    change = Column(Integer)
    search_volume = Column(Integer)
    difficulty = Column(Integer)
    intent = Column(String)
    url = Column(String)
    trend = Column(String)
    last_optimization = Column(String)
    competitor_position = Column(Integer)
    citation_count = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    website = relationship("Website", back_populates="keywords")

class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(String, primary_key=True, index=True) # e.g. SEO-014
    website_id = Column(String, ForeignKey("websites.id"))
    title = Column(String)
    target_url = Column(String)
    target_keywords = Column(JSON)
    hypothesis = Column(Text)
    changes_made = Column(JSON)
    start_date = Column(String)
    end_date = Column(String, nullable=True)
    before_position = Column(Float)
    after_position = Column(Float, nullable=True)
    traffic_before = Column(Integer)
    traffic_after = Column(Integer, nullable=True)
    ctr_before = Column(Float)
    ctr_after = Column(Float, nullable=True)
    outcome = Column(String, default="In Progress") # Successful, Failed, In Progress
    confidence = Column(Float, default=80.0)
    notes = Column(Text, nullable=True)
    hindsight_stored = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    website = relationship("Website", back_populates="experiments")

class Competitor(Base):
    __tablename__ = "competitors"

    id = Column(String, primary_key=True, index=True)
    domain = Column(String, unique=True, index=True)
    name = Column(String)
    visibility_score = Column(Integer)
    ranking_keywords = Column(Integer)
    content_published_month = Column(Integer)
    new_pages_30d = Column(Integer)
    backlinks_gained_30d = Column(Integer)
    citation_presence = Column(String)
    serp_features = Column(JSON)
    recent_events = Column(JSON)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

class Citation(Base):
    __tablename__ = "citations"

    id = Column(String, primary_key=True, index=True)
    source_domain = Column(String)
    source_title = Column(String)
    source_type = Column(String)
    brand_mentioned = Column(String, nullable=True)
    competitors_mentioned = Column(JSON)
    citation_url = Column(String)
    status = Column(String) # Cited, Uncited Opportunity
    ai_search_visibility = Column(Boolean, default=False)
    context = Column(Text)
    date = Column(String)

class LearnedPattern(Base):
    __tablename__ = "learned_patterns"

    id = Column(String, primary_key=True, index=True)
    pattern_name = Column(String)
    summary = Column(Text)
    evidence_count = Column(Integer)
    average_improvement = Column(String)
    confidence = Column(Float)
    category = Column(String)
    successful_experiments = Column(JSON)
    failed_experiments = Column(JSON)
    insight = Column(Text)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

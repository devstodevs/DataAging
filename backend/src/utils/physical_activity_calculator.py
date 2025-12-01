"""
Physical Activity Calculator utilities for WHO compliance and sedentary risk assessment
"""
from typing import Tuple


def calculate_weekly_totals(minutes_per_day: int, days_per_week: int) -> int:
    """Calculate total weekly minutes for an activity"""
    return minutes_per_day * days_per_week


def calculate_who_compliance(total_weekly_moderate: int, total_weekly_vigorous: int) -> bool:
    """
    Calculate WHO compliance based on weekly activity totals
    
    WHO Guidelines for older adults (60+):
    - At least 150 minutes of moderate-intensity aerobic activity per week, OR
    - At least 75 minutes of vigorous-intensity aerobic activity per week
    
    Args:
        total_weekly_moderate: Total weekly moderate activity minutes
        total_weekly_vigorous: Total weekly vigorous activity minutes
        
    Returns:
        bool: True if compliant with WHO guidelines
    """
    return total_weekly_moderate >= 150 or total_weekly_vigorous >= 75


def calculate_sedentary_risk_level(sedentary_hours_per_day: float) -> str:
    """
    Calculate sedentary risk level based on daily sedentary hours.
    
    IMPORTANT: The WHO does not establish specific daily hour limits for sedentary behavior.
    However, scientific evidence indicates that excessive sedentary time is associated with
    increased health risks, particularly cardiovascular disease, diabetes type 2, and cancer.
    
    Evidence-based thresholds:
    - Studies show that >10 hours/day significantly increases cardiovascular risk and mortality,
      even in physically active individuals
    - The WHO recommends limiting sedentary time and increasing physical activity, but does not
      specify exact hour thresholds
    
    Risk levels (based on clinical practice and available evidence):
    - Baixo: <6 hours/day - Lower risk, within acceptable range
    - Moderado: 6-8 hours/day - Moderate risk, attention recommended
    - Alto: 8-10 hours/day - High risk, intervention recommended
    - Crítico: >10 hours/day - Critical risk, significant health concerns
    
    References:
    - WHO Guidelines on Physical Activity and Sedentary Behaviour (2020)
    - Studies linking >10h/day sedentary time to increased cardiovascular risk
    
    Args:
        sedentary_hours_per_day: Daily sedentary hours (0-24)
        
    Returns:
        str: Risk level classification ("Baixo", "Moderado", "Alto", or "Crítico")
    """
    if sedentary_hours_per_day < 6:
        return "Baixo"
    elif sedentary_hours_per_day < 8:
        return "Moderado"
    elif sedentary_hours_per_day <= 10:
        return "Alto"
    else:
        return "Crítico"


def calculate_evaluation_metrics(
    light_minutes_per_day: int,
    light_days_per_week: int,
    moderate_minutes_per_day: int,
    moderate_days_per_week: int,
    vigorous_minutes_per_day: int,
    vigorous_days_per_week: int,
    sedentary_hours_per_day: float
) -> Tuple[int, int, bool, str]:
    """
    Calculate all evaluation metrics for a physical activity assessment
    
    Args:
        light_minutes_per_day: Daily light activity minutes
        light_days_per_week: Weekly light activity days
        moderate_minutes_per_day: Daily moderate activity minutes
        moderate_days_per_week: Weekly moderate activity days
        vigorous_minutes_per_day: Daily vigorous activity minutes
        vigorous_days_per_week: Weekly vigorous activity days
        sedentary_hours_per_day: Daily sedentary hours
        
    Returns:
        Tuple containing:
        - total_weekly_moderate_minutes: int
        - total_weekly_vigorous_minutes: int
        - who_compliance: bool
        - sedentary_risk_level: str
    """
    # Calculate weekly totals
    total_weekly_moderate = calculate_weekly_totals(moderate_minutes_per_day, moderate_days_per_week)
    total_weekly_vigorous = calculate_weekly_totals(vigorous_minutes_per_day, vigorous_days_per_week)
    
    # Calculate WHO compliance
    who_compliance = calculate_who_compliance(total_weekly_moderate, total_weekly_vigorous)
    
    # Calculate sedentary risk level
    sedentary_risk_level = calculate_sedentary_risk_level(sedentary_hours_per_day)
    
    return total_weekly_moderate, total_weekly_vigorous, who_compliance, sedentary_risk_level


def validate_time_consistency(
    light_minutes_per_day: int,
    light_days_per_week: int,
    moderate_minutes_per_day: int,
    moderate_days_per_week: int,
    vigorous_minutes_per_day: int,
    vigorous_days_per_week: int,
    sedentary_hours_per_day: float,
    screen_time_hours_per_day: float
) -> bool:
    """
    Validate that the sum of activities and sedentary time is reasonable
    
    This is a basic validation - in reality, activities can overlap with sedentary time
    (e.g., someone can be sedentary for 10 hours but also do 30 minutes of exercise)
    
    Args:
        All activity and sedentary parameters
        
    Returns:
        bool: True if time allocation seems reasonable
    """
    # Calculate maximum daily activity time (assuming worst case - all on same day)
    max_daily_activity_hours = max([
        (light_minutes_per_day + moderate_minutes_per_day + vigorous_minutes_per_day) / 60
        if light_days_per_week > 0 or moderate_days_per_week > 0 or vigorous_days_per_week > 0
        else 0
    ])
    
    # Basic validation: sedentary + max activity should not exceed 24 hours by much
    # Allow some flexibility as activities can be part of non-sedentary time
    total_time = sedentary_hours_per_day + max_daily_activity_hours
    
    return total_time <= 26  # Allow 2 hours buffer for flexibility
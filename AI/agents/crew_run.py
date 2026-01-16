import os
from agents.multi_agents import MathCrew

os.makedirs('output', exist_ok=True)

def run(inputs):
    """
    Run the math crew and return the final output.
    
    Args:
        inputs: The user's mathematical problem
        
    Returns:
        The crew's final output
    """
    inputs_dict = {
        'topic': inputs,
    }
    
    result = MathCrew().crew().kickoff(inputs=inputs_dict)
    
    print("\n\n=== FINAL REPORT ===\n\n")
    print(result.raw)

    print("\n\nReport has been saved to output/report.md")
    
    # Return the result so it can be used by the API
    return result

import pytest
from tools.preprocessing_tools import InputProcessing 


def test_basic_tool_action_and_simple_fields():
    input_str = """
Tool: Calculator
Action: calculate

Equations: x + y = 10
Variables: x=5, y=5
Description: Simple addition test
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'Calculator'
    assert result['action'] == 'calculate'
    assert result['equations'] == 'x + y = 10'
    assert result['variables'] == 'x=5, y=5'
    assert result['description'] == 'Simple addition test'


def test_with_list_fields():
    input_str = """
Tool: Search
Action: web_search

Queries:
- Python JSON library
- Regular expression examples

Options:
- num_results: 10
- safe_search: true
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'Search'
    assert result['action'] == 'web_search'
    assert result['queries'] == ['Python JSON library', 'Regular expression examples']
    assert result['options'] == ['num_results: 10', 'safe_search: true']


def test_multiple_lists_and_mixed_content():
    input_str = """
Tool: CodeExecutor
Action: execute

Code:
- import json
- data = {"a": 1}
- print(json.dumps(data))

Expected Output:
- {"a": 1}

Parameters:
- language: python
- timeout: 30
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'CodeExecutor'
    assert result['action'] == 'execute'
    assert result['code'] == ['import json', 'data = {"a": 1}', 'print(json.dumps(data))']
    assert result['expected output'] == ['{"a": 1}']
    assert result['parameters'] == ['language: python', 'timeout: 30']


def test_missing_tool_or_action():
    input_str = """
Equations: 2x + 3 = 7
Variables: x unknown
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] is None
    assert result['action'] is None
    assert result['equations'] == '2x + 3 = 7'
    assert result['variables'] == 'x unknown'


def test_empty_input():
    input_str = ""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] is None
    assert result['action'] is None
    assert len(result) == 2  # Chỉ có tool và action là None


# Calculator Tool Tests
def test_calculator_simple_arithmetic():
    input_str = """
Tool: calculator
Action: evaluate

Expression: 25 + 15 * 2 - 10 / 5
Variables:
- None
Precision: 2
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'calculator'
    assert result['action'] == 'evaluate'
    assert result['expression'] == '25 + 15 * 2 - 10 / 5'
    assert result['variables'] == ['None']
    assert result['precision'] == '2'


def test_calculator_with_variables():
    input_str = """
Tool: calculator
Action: solve_equation

Expression: 3x + 5 = 20
Variables:
- x
- y (optional)
Decimal_Places: 4
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'calculator'
    assert result['action'] == 'solve_equation'
    assert result['expression'] == '3x + 5 = 20'
    assert result['variables'] == ['x', 'y (optional)']
    assert result['decimal_places'] == '4'


def test_calculator_trigonometric():
    input_str = """
Tool: calculator
Action: compute_trigonometric

Functions:
- sin(45°)
- cos(60°)
- tan(30°)

Unit: degrees
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'calculator'
    assert result['action'] == 'compute_trigonometric'
    assert result['functions'] == ['sin(45°)', 'cos(60°)', 'tan(30°)']
    assert result['unit'] == 'degrees'


# Matrix Tool Tests
def test_matrix_addition():
    input_str = """
Tool: matrix
Action: add_matrices

Matrix_A:
- [1, 2, 3]
- [4, 5, 6]

Matrix_B:
- [7, 8, 9]
- [10, 11, 12]

Operation_Type: element_wise
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'matrix'
    assert result['action'] == 'add_matrices'
    assert result['matrix_a'] == ['[1, 2, 3]', '[4, 5, 6]']
    assert result['matrix_b'] == ['[7, 8, 9]', '[10, 11, 12]']
    assert result['operation_type'] == 'element_wise'


def test_matrix_multiplication():
    input_str = """
Tool: matrix
Action: multiply_matrices

Matrix_A:
- [1, 2]
- [3, 4]

Matrix_B:
- [5, 6]
- [7, 8]

Return_Type: numpy_array
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'matrix'
    assert result['action'] == 'multiply_matrices'
    assert result['matrix_a'] == ['[1, 2]', '[3, 4]']
    assert result['matrix_b'] == ['[5, 6]', '[7, 8]']
    assert result['return_type'] == 'numpy_array'


def test_matrix_transpose():
    input_str = """
Tool: matrix
Action: transpose

Matrix:
- [1, 2, 3, 4]
- [5, 6, 7, 8]
- [9, 10, 11, 12]

Output_Format: list
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'matrix'
    assert result['action'] == 'transpose'
    assert result['matrix'] == ['[1, 2, 3, 4]', '[5, 6, 7, 8]', '[9, 10, 11, 12]']
    assert result['output_format'] == 'list'


def test_matrix_determinant():
    input_str = """
Tool: matrix
Action: calculate_determinant

Matrix:
- [4, 7]
- [2, 6]

Precision: 3
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'matrix'
    assert result['action'] == 'calculate_determinant'
    assert result['matrix'] == ['[4, 7]', '[2, 6]']
    assert result['precision'] == '3'


# Statistics Tool Tests
def test_statistics_mean_median_mode():
    input_str = """
Tool: statistics
Action: compute_descriptive_stats

Dataset:
- 10
- 20
- 30
- 40
- 50
- 60

Metrics:
- mean
- median
- mode

Return_Type: dict
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'statistics'
    assert result['action'] == 'compute_descriptive_stats'
    assert result['dataset'] == ['10', '20', '30', '40', '50', '60']
    assert result['metrics'] == ['mean', 'median', 'mode']
    assert result['return_type'] == 'dict'


def test_statistics_correlation():
    input_str = """
Tool: statistics
Action: calculate_correlation

Variable_X:
- 1
- 2
- 3
- 4
- 5

Variable_Y:
- 2
- 4
- 5
- 4
- 6

Method: pearson
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'statistics'
    assert result['action'] == 'calculate_correlation'
    assert result['variable_x'] == ['1', '2', '3', '4', '5']
    assert result['variable_y'] == ['2', '4', '5', '4', '6']
    assert result['method'] == 'pearson'


def test_statistics_standard_deviation():
    input_str = """
Tool: statistics
Action: calculate_standard_deviation

Data:
- 85
- 90
- 78
- 92
- 88
- 95

Sample: true
Decimal_Places: 2
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'statistics'
    assert result['action'] == 'calculate_standard_deviation'
    assert result['data'] == ['85', '90', '78', '92', '88', '95']
    assert result['sample'] == 'true'
    assert result['decimal_places'] == '2'


def test_statistics_regression():
    input_str = """
Tool: statistics
Action: perform_regression

X_Values:
- 1
- 2
- 3
- 4
- 5

Y_Values:
- 2.1
- 3.9
- 6.2
- 7.8
- 10.1

Regression_Type: linear
Include_Confidence_Interval: true
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'statistics'
    assert result['action'] == 'perform_regression'
    assert result['x_values'] == ['1', '2', '3', '4', '5']
    assert result['y_values'] == ['2.1', '3.9', '6.2', '7.8', '10.1']
    assert result['regression_type'] == 'linear'
    assert result['include_confidence_interval'] == 'true'


def test_statistics_distribution_analysis():
    input_str = """
Tool: statistics
Action: analyze_distribution

Sample_Data:
- 100
- 102
- 101
- 103
- 99
- 104
- 98
- 102

Distribution_Type: normal
Significance_Level: 0.05
"""
    proc = InputProcessing(input_str)
    result = proc.input_processing()

    assert result['tool'] == 'statistics'
    assert result['action'] == 'analyze_distribution'
    assert result['sample_data'] == ['100', '102', '101', '103', '99', '104', '98', '102']
    assert result['distribution_type'] == 'normal'
    assert result['significance_level'] == '0.05'
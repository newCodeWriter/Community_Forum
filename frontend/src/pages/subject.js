/** @format */

import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";

class Subject extends Component {
	constructor(props) {
		super(props);
		this.state = {
			questions: [],
		};
	}

	componentDidMount() {
		axios
			.get(`/category/${this.props.match.params.subjectId}`)
			.then((res) => this.setState({ questions: [...res.data] }));
	}

	componentDidUpdate(prevProps) {
		if (this.props.data !== prevProps.data) {
			this.setState({ questions: [...this.props.data] });
		}
	}

	newQuestion = () =>
		this.props.history.push(`${this.props.match.url}/question`);

	render() {
		const { questions } = this.state;
		const { url } = this.props.match;

		return (
			<div className="set-width mx-auto">
				<Button
					variant="primary"
					className="mb-4 pl-3 pr-3 pt-2 pb-2"
					onClick={this.newQuestion}
				>
					New Question?
				</Button>
				{questions.map((q) => (
					<Link
						key={`question_${q.question_id}`}
						to={`${url}/${q.question_id}`}
					>
						<div
							id={q.question_id}
							className="border border-light bg-light d-block mb-3 p-3 subject-container shadow"
						>
							<div className="row">
								<div className="col-md-5 text-muted small">
									{q.question_date}
								</div>
								<div className="col-md-7 text-success text-right small q-user">
									by: {q.submit_user}
								</div>
							</div>
							<div className="row mt-3 w-100">
								<div className="col">{q.question}</div>
							</div>
							<div className="row mt-2 text-muted">
								<div className="col text-right small">
									Answers: {q.responses.length}
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		);
	}
}
const mapStateToProps = (state) => ({
	data: state.categoryDataRequest,
});

Subject.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			subjectId: PropTypes.string,
		}),
	}),
};

export default connect(mapStateToProps)(Subject);

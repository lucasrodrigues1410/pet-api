export abstract class Entity<Props> {
	private _id: number;
	protected props: Props;

	get id() {
		return this._id;
	}

	protected constructor(props: Props, id?: number) {
		this.props = props;
		this._id = id ?? 0;
	}

	public equals(entity: Entity<unknown>) {
		if (entity === this) {
			return true;
		}

		if (entity.id === this._id) {
			return true;
		}

		return false;
	}
}

import create from 'zustand';

const [useStore] = create((set) => ({
	count: 1,
	inc: () => set((state) => ({ count: state.count + 1 })),
	dec: () => set((state) => ({ count: state.count - 1 })),
}));

function Counter() {
	const { count, inc, dec } = useStore();
	return (
		<div class="counter">
			<span>{count}</span>
			<button onClick={inc}>up</button>
			<button onClick={dec}>down</button>
		</div>
	);
}

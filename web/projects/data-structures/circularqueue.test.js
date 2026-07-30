import { describe, expect, it } from "bun:test";
import { Queue } from "./circularqueue.js"; // Assume this file contains the fixed Queue class

describe("Queue", () => {
    it("should initialize with correct default values", () => {
        const queue = new Queue();
        expect(queue.isEmpty).toBe(true);
        expect(queue.isFull).toBe(false);
        expect(queue.length).toBe(0);
    });

    it("should enqueue elements correctly", () => {
        const queue = new Queue();
        queue.enqueue(1);
        queue.enqueue(2);
        expect(queue.isEmpty).toBe(false);
        expect(queue.length).toBe(2);
    });

    it("should dequeue elements correctly", () => {
        const queue = new Queue();
        queue.enqueue(1);
        queue.enqueue(2);
        expect(queue.dequeue()).toBe(1);
        expect(queue.length).toBe(1);
        expect(queue.dequeue()).toBe(2);
        expect(queue.isEmpty).toBe(true);
    });

    it("should follow FIFO order", () => {
        const queue = new Queue();
        queue.enqueue("a");
        queue.enqueue("b");
        queue.enqueue("c");
        expect(queue.dequeue()).toBe("a");
        expect(queue.dequeue()).toBe("b");
        expect(queue.dequeue()).toBe("c");
    });

    it("should throw error when dequeuing from an empty queue", () => {
        const queue = new Queue();
        expect(() => queue.dequeue()).toThrow("Queue is empty");
    });

    it("should throw error when enqueueing to a full queue", () => {
        const queue = new Queue();
        for (let i = 0; i < 8; i++) {
            queue.enqueue(i);
        }
        expect(queue.isFull).toBe(true);
        expect(() => queue.enqueue(9)).toThrow("Queue is full");
    });

    it("should wrap around correctly when reaching maxLength", () => {
        const queue = new Queue();
        for (let i = 0; i < 8; i++) {
            queue.enqueue(i);
        }
        expect(queue.isFull).toBe(true);
        expect(queue.dequeue()).toBe(0);
        expect(queue.dequeue()).toBe(1);
        queue.enqueue(9);
        queue.enqueue(10);
        expect(queue.length).toBe(8);
        expect(queue.dequeue()).toBe(2);
        expect(queue.dequeue()).toBe(3);
    });

    it("should return correct values for isEmpty and isFull", () => {
        const queue = new Queue();
        expect(queue.isEmpty).toBe(true);
        expect(queue.isFull).toBe(false);

        for (let i = 0; i < 8; i++) {
            queue.enqueue(i);
        }

        expect(queue.isEmpty).toBe(false);
        expect(queue.isFull).toBe(true);
    });
});

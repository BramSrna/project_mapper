import numpy as np

class SimpleRNN:
    def __init__(self, input_size, hidden_size, output_size):
        # Initialize parameters
        self.input_size = input_size
        
        self.hidden_size = hidden_size
        self.output_size = output_size

        self.Wxh = np.random.randn(hidden_size, input_size) * 0.01  # Input to hidden weights
        self.Whh = np.random.randn(hidden_size, hidden_size) * 0.01  # Hidden to hidden weights
        self.Why = np.random.randn(output_size, hidden_size) * 0.01  # Hidden to output weights

        self.bh = np.zeros((hidden_size, 1))  # Hidden bias
        self.by = np.zeros((output_size, 1))  # Output bias

    def forward(self, inputs, h_prev):
        # Forward pass
        self.h = np.tanh(np.dot(self.Wxh, inputs) + np.dot(self.Whh, h_prev) + self.bh)
        self.y = np.dot(self.Why, self.h) + self.by
        self.probabilities = np.exp(self.y) / np.sum(np.exp(self.y), axis=0)  # Softmax activation

        return self.probabilities, self.h

    def backward(self, inputs, targets, h_prev, dh_next):
        # Backward pass
        dy = np.copy(self.probabilities)
        dy[targets] -= 1  # Gradient of cross-entropy loss with respect to y

        dWhy = np.dot(dy, self.h.T)
        dby = np.sum(dy, axis=1, keepdims=True)

        dh = np.dot(self.Why.T, dy) + dh_next
        dh_raw = (1 - self.h ** 2) * dh

        dWxh = np.dot(dh_raw, inputs.T)
        dWhh = np.dot(dh_raw, h_prev.T)
        dbh = np.sum(dh_raw, axis=1, keepdims=True)

        return dWxh, dWhh, dWhy, dbh, dby, dh_raw

    def train(self, inputs, targets, h_prev):
        loss = 0
        xs, hs, ys, ps = {}, {}, {}, {}

        # Forward pass
        hs[-1] = np.copy(h_prev)
        for t in range(len(inputs)):
            xs[t] = np.zeros((self.input_size, 1))
            xs[t][inputs[t]] = 1  # One-hot encoding of the input
            ys[t], hs[t] = self.forward(xs[t], hs[t - 1])

            # Accumulate loss
            loss += -np.log(ys[t][targets[t], 0])

        # Backward pass
        dWxh, dWhh, dWhy = np.zeros_like(self.Wxh), np.zeros_like(self.Whh), np.zeros_like(self.Why)
        dbh, dby = np.zeros_like(self.bh), np.zeros_like(self.by)
        dh_next = np.zeros_like(hs[0])

        for t in reversed(range(len(inputs))):
            dWxh_t, dWhh_t, dWhy_t, dbh_t, dby_t, dh_next = self.backward(xs[t], targets[t], hs[t - 1], dh_next)
            dWxh += dWxh_t
            dWhh += dWhh_t
            dWhy += dWhy_t
            dbh += dbh_t
            dby += dby_t

        # Update parameters using gradient descent
        learning_rate = 0.01
        self.Wxh -= learning_rate * dWxh
        self.Whh -= learning_rate * dWhh
        self.Why -= learning_rate * dWhy
        self.bh -= learning_rate * dbh
        self.by -= learning_rate * dby

        return loss

# Example usage
input_size = 3
hidden_size = 5
output_size = 2

rnn = SimpleRNN(input_size, hidden_size, output_size)

# Dummy data (replace with your actual data)
inputs = [0, 1, 2, 1]
targets = [1, 0, 1, 0]

# Initial hidden state
h_prev = np.zeros((hidden_size, 1))

# Training loop
num_epochs = 1000
for epoch in range(num_epochs):
    loss = rnn.train(inputs, targets, h_prev)
    if epoch % 100 == 0:
        print(f"Epoch {epoch}, Loss: {loss}")

# Generate predictions (forward pass)
print(np.eye(input_size))
print(np.eye(input_size)[:])
print(np.eye(input_size)[:, 1])
print(np.eye(input_size)[:, 1].T)
predictions, _ = rnn.forward(np.eye(input_size)[:, 1].T, h_prev)
predicted_labels = np.argmax(predictions, axis=0)
print("Predicted Labels:", predicted_labels)